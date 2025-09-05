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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/index';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Project, ProjectStatus } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new project. Clients can only create projects for themselves.',
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only create projects for themselves',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, user.role, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve projects with filtering and pagination. Clients can only see their own projects.',
  })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client ID (Admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: ProjectStatus, description: 'Filter by project status' })
  @ApiQuery({ name: 'country', required: false, description: 'Filter by country' })
  @ApiQuery({ name: 'service', required: false, description: 'Filter by service needed' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Projects per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async findAll(
    @Query() queryDto: ProjectQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.findAll(queryDto, user.role, user.id);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get project statistics',
    description: 'Get statistics about projects. Clients can only see stats for their own projects.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only see their own project stats',
  })
  async getStats(@CurrentUser() user: User) {
    return this.projectsService.getProjectStats(user.role, user.id);
  }

  @Get('client/:clientId')
  @ApiOperation({
    summary: 'Get projects by client ID',
    description: 'Retrieve all projects for a specific client. Clients can only see their own projects.',
  })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only access their own projects',
  })
  async getProjectsByClient(
    @Param('clientId') clientId: string,
    @CurrentUser() user: User,
  ): Promise<Project[]> {
    return this.projectsService.getProjectsByClient(clientId, user.role, user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Retrieve a specific project by its ID. Clients can only see their own projects.',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only access their own projects',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.findOne(id, user.role, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update a project. Clients can only update their own projects.',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only update their own projects',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.update(id, updateProjectDto, user.role, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update project status',
    description: 'Update the status of a project. Clients can only update their own projects.',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(ProjectStatus),
          example: ProjectStatus.ACTIVE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Project status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid status provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only update their own projects',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProjectStatus,
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.updateStatus(id, status, user.role, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete project',
    description: 'Delete a project. Clients can only delete their own projects.',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({
    status: 204,
    description: 'Project deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Client can only delete their own projects',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.projectsService.remove(id, user.role, user.id);
  }
}
