import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResearchDocumentDto {
  @ApiProperty({
    example: 'project-123',
    description: 'ID of the project this document belongs to',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'Market Research Report Q4 2024',
    description: 'Title of the research document',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This document contains comprehensive market analysis...',
    description: 'Content of the research document',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['market-research', 'q4-2024', 'analysis'],
    description: 'Tags for categorizing the document',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: 'https://storage.example.com/documents/research-report.pdf',
    description: 'URL to the uploaded file (optional)',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  fileUrl?: string;
}

export class UpdateResearchDocumentDto {
  @ApiProperty({
    example: 'Updated Market Research Report Q4 2024',
    description: 'Updated title of the research document',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated content with new findings...',
    description: 'Updated content of the research document',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: ['market-research', 'q4-2024', 'analysis', 'updated'],
    description: 'Updated tags for categorizing the document',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: 'https://storage.example.com/documents/updated-research-report.pdf',
    description: 'Updated URL to the uploaded file',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  fileUrl?: string;
}

export class ResearchDocumentResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId of the document',
  })
  _id: string;

  @ApiProperty({
    example: 'project-123',
    description: 'ID of the project this document belongs to',
  })
  projectId: string;

  @ApiProperty({
    example: 'Market Research Report Q4 2024',
    description: 'Title of the research document',
  })
  title: string;

  @ApiProperty({
    example: 'This document contains comprehensive market analysis...',
    description: 'Content of the research document',
  })
  content: string;

  @ApiProperty({
    example: ['market-research', 'q4-2024', 'analysis'],
    description: 'Tags for categorizing the document',
  })
  tags: string[];

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the document was uploaded',
  })
  uploadedAt: Date;

  @ApiProperty({
    example: 'https://storage.example.com/documents/research-report.pdf',
    description: 'URL to the uploaded file',
    required: false,
  })
  fileUrl?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the document was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the document was last updated',
  })
  updatedAt: Date;
}

export class SearchResearchDocumentsDto {
  @ApiProperty({
    example: 'market research',
    description: 'Search query for text search',
    required: false,
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({
    example: 'project-123',
    description: 'Filter by project ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    example: ['market-research', 'analysis'],
    description: 'Filter by tags',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of documents per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  limit?: number = 10;
}

export class UploadResearchDocumentDto {
  @ApiProperty({
    example: 'project-123',
    description: 'ID of the project this document belongs to',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'Market Research Report Q4 2024',
    description: 'Title of the research document',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This document contains comprehensive market analysis...',
    description: 'Content of the research document',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'market-research,q4-2024,analysis',
    description: 'Tags for categorizing the document (comma-separated string)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
