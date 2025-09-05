import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResearchService } from './research.service';
import { 
  CreateResearchDocumentDto, 
  UpdateResearchDocumentDto, 
  SearchResearchDocumentsDto,
  ResearchDocumentResponseDto,
  UploadResearchDocumentDto
} from './dto/research-document.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Research Documents')
@Controller('research')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new research document',
    description: 'Create a new research document (Admin only)'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Research document created successfully',
    type: ResearchDocumentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  async create(@Body() createResearchDocumentDto: CreateResearchDocumentDto): Promise<ResearchDocumentResponseDto> {
    return this.researchService.create(createResearchDocumentDto);
  }

  @Post('upload')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Upload research document with file',
    description: 'Upload a research document with an attached file (Admin only)'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Research document data with file upload',
    schema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          example: 'project-123',
          description: 'ID of the project this document belongs to'
        },
        title: {
          type: 'string',
          example: 'Market Research Report Q4 2024',
          description: 'Title of the research document'
        },
        content: {
          type: 'string',
          example: 'This document contains comprehensive market analysis...',
          description: 'Content of the research document'
        },
        tags: {
          type: 'string',
          example: 'market-research,q4-2024,analysis',
          description: 'Tags for categorizing the document (comma-separated)'
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Research document file (PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, PPT, PPTX)'
        }
      },
      required: ['projectId', 'title', 'content', 'file']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Research document uploaded successfully',
    type: ResearchDocumentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data or file provided'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  async uploadWithFile(
    @Body() uploadDto: UploadResearchDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResearchDocumentResponseDto> {
    return this.researchService.uploadWithFile(uploadDto, file);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all research documents',
    description: 'Retrieve research documents with optional search and filtering'
  })
  @ApiQuery({ name: 'query', required: false, description: 'Text search query' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Documents per page', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Research documents retrieved successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async findAll(@Query() searchDto: SearchResearchDocumentsDto) {
    return this.researchService.findAll(searchDto);
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search research documents by text',
    description: 'Perform full-text search on research documents'
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    type: [ResearchDocumentResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async searchByText(
    @Query('q') query: string,
    @Query('projectId') projectId?: string
  ): Promise<ResearchDocumentResponseDto[]> {
    return this.researchService.searchByText(query, projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ 
    summary: 'Get research documents by project ID',
    description: 'Retrieve all research documents for a specific project'
  })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Research documents retrieved successfully',
    type: [ResearchDocumentResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async findByProjectId(@Param('projectId') projectId: string): Promise<ResearchDocumentResponseDto[]> {
    return this.researchService.findByProjectId(projectId);
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiOperation({ 
    summary: 'Get research document statistics',
    description: 'Get statistics about research documents (Admin only)'
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter stats by project ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  async getStats(@Query('projectId') projectId?: string) {
    return this.researchService.getDocumentStats(projectId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get research document by ID',
    description: 'Retrieve a specific research document by its ID'
  })
  @ApiParam({ name: 'id', description: 'Research document ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Research document retrieved successfully',
    type: ResearchDocumentResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Research document not found'
  })
  async findOne(@Param('id') id: string): Promise<ResearchDocumentResponseDto> {
    return this.researchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ 
    summary: 'Update research document',
    description: 'Update a research document (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Research document ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Research document updated successfully',
    type: ResearchDocumentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Research document not found'
  })
  async update(
    @Param('id') id: string, 
    @Body() updateResearchDocumentDto: UpdateResearchDocumentDto
  ): Promise<ResearchDocumentResponseDto> {
    return this.researchService.update(id, updateResearchDocumentDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete research document',
    description: 'Delete a research document (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Research document ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'Research document deleted successfully'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Admin access required'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Research document not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.researchService.remove(id);
  }
}
