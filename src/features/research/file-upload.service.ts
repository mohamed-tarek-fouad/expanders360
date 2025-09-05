import { Injectable, BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  private readonly maxFileSize = 500 * 1024 * 1024; // 500MB
  private readonly uploadDir = join(process.cwd(), 'uploads', 'research');

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }
  }

  generateFileName(originalName: string): string {
    const fileExt = extname(originalName);
    const fileName = uuidv4();
    return `${fileName}${fileExt}`;
  }

  async saveFile(file: Express.Multer.File, fileName: string): Promise<string> {
    try {
      // Ensure upload directory exists
      if (!existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }

      // Create full file path
      const filePath = join(this.uploadDir, fileName);

      // Write file to disk
      await writeFile(filePath, file.buffer);

      return filePath;
    } catch {
      throw new BadRequestException('Failed to save file');
    }
  }

  getFileUrl(fileName: string): string {
    return `/uploads/research/${fileName}`;
  }

  getFileStoragePath(fileName: string): string {
    return join(this.uploadDir, fileName);
  }
}
