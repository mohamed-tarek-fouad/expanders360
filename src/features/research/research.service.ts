import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { ResearchDocument } from './schemas/research-document.schema';
import {
  CreateResearchDocumentDto,
  UpdateResearchDocumentDto,
  SearchResearchDocumentsDto,
  ResearchDocumentResponseDto,
  UploadResearchDocumentDto
} from './dto/research-document.dto';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel('ResearchDocument')
    private researchDocumentModel: Model<ResearchDocument>,
    private fileUploadService: FileUploadService
  ) {}

  async create(createDto: CreateResearchDocumentDto): Promise<ResearchDocumentResponseDto> {
    try {
      const document = new this.researchDocumentModel(createDto);
      const savedDocument = await document.save();
      return this.mapToResponseDto(savedDocument);
    } catch {
      throw new BadRequestException('Failed to create research document');
    }
  }

  async uploadWithFile(
    uploadDto: UploadResearchDocumentDto,
    file: Express.Multer.File
  ): Promise<ResearchDocumentResponseDto> {
    try {
      // Validate the uploaded file
      this.fileUploadService.validateFile(file);

      // Generate unique filename
      const fileName = this.fileUploadService.generateFileName(file.originalname);

      // Save file to disk
      await this.fileUploadService.saveFile(file, fileName);

      // Generate file URL
      const fileUrl = this.fileUploadService.getFileUrl(fileName);

      // Create document with file information
      const documentData = {
        ...uploadDto,
        fileUrl,
        uploadedAt: new Date()
      };

      const document = new this.researchDocumentModel(documentData);
      const savedDocument = await document.save();

      return this.mapToResponseDto(savedDocument);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload research document');
    }
  }

  async findAll(searchDto: SearchResearchDocumentsDto): Promise<{
    documents: ResearchDocumentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { query, projectId, tags, page = 1, limit = 10 } = searchDto;

    // Build filter query
    const filter: FilterQuery<ResearchDocument> = {};

    if (projectId) {
      filter.projectId = projectId;
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (query) {
      filter.$text = { $search: query };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [documents, total] = await Promise.all([
      this.researchDocumentModel
        .find(filter)
        .sort(query ? { score: { $meta: 'textScore' } } : { uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.researchDocumentModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      documents: documents.map(doc => this.mapToResponseDto(doc)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async findOne(id: string): Promise<ResearchDocumentResponseDto> {
    const document = await this.researchDocumentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException('Research document not found');
    }
    return this.mapToResponseDto(document);
  }

  async findByProjectId(projectId: string): Promise<ResearchDocumentResponseDto[]> {
    const documents = await this.researchDocumentModel
      .find({ projectId })
      .sort({ uploadedAt: -1 })
      .exec();

    return documents.map(doc => this.mapToResponseDto(doc));
  }

  async update(id: string, updateDto: UpdateResearchDocumentDto): Promise<ResearchDocumentResponseDto> {
    try {
      const document = await this.researchDocumentModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();

      if (!document) {
        throw new NotFoundException('Research document not found');
      }

      return this.mapToResponseDto(document);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update research document');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.researchDocumentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Research document not found');
    }
  }

  async searchByText(query: string, projectId?: string): Promise<ResearchDocumentResponseDto[]> {
    const filter: FilterQuery<ResearchDocument> = {
      $text: { $search: query }
    };

    if (projectId) {
      filter.projectId = projectId;
    }

    const documents = await this.researchDocumentModel
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .exec();

    return documents.map(doc => this.mapToResponseDto(doc));
  }

  async getDocumentStats(projectId?: string): Promise<{
    totalDocuments: number;
    documentsByProject: { [key: string]: number };
    recentDocuments: number;
  }> {
    const filter: FilterQuery<ResearchDocument> = {};
    if (projectId) {
      filter.projectId = projectId;
    }

    const [totalDocuments, documentsByProject, recentDocuments] = await Promise.all([
      this.researchDocumentModel.countDocuments(filter),
      this.researchDocumentModel.aggregate([
        { $match: filter },
        { $group: { _id: '$projectId', count: { $sum: 1 } } }
      ]),
      this.researchDocumentModel.countDocuments({
        ...filter,
        uploadedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    ]);

    const projectStats = documentsByProject.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return {
      totalDocuments,
      documentsByProject: projectStats,
      recentDocuments
    };
  }

  private mapToResponseDto(document: ResearchDocument): ResearchDocumentResponseDto {
    return {
      _id: (document._id as any).toString(),
      projectId: document.projectId,
      title: document.title,
      content: document.content,
      tags: document.tags,
      uploadedAt: document.uploadedAt,
      fileUrl: document.fileUrl,
      createdAt: (document as any).createdAt,
      updatedAt: (document as any).updatedAt
    };
  }
}
