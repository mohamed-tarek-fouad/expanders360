import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';
import { Project, ProjectStatus, UserRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userRole: UserRole, userClientId?: string): Promise<Project> {
    // Check if client exists
    const client = await this.prisma.client.findUnique({
      where: { id: createProjectDto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // If user is a client, they can only create projects for themselves
    if (userRole === UserRole.CLIENT && userClientId !== createProjectDto.clientId) {
      throw new ForbiddenException('You can only create projects for your own client account');
    }

    try {
      const project = await this.prisma.project.create({
        data: {
          ...createProjectDto,
          servicesNeeded: createProjectDto.servicesNeeded,
        },
        include: {
          client: true,
          matches: {
            include: {
              vendor: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      throw new BadRequestException('Failed to create project');
    }
  }

  async findAll(queryDto: ProjectQueryDto, userRole: UserRole, userClientId?: string) {
    const {
      clientId,
      status,
      country,
      service,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    // Build where clause
    const where: any = {};

    // If user is a client, they can only see their own projects
    if (userRole === UserRole.CLIENT) {
      if (userClientId) {
        where.clientId = userClientId;
      } else {
        throw new ForbiddenException('Client ID not found in user context');
      }
    } else if (clientId) {
      // Admin can filter by specific client
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    if (country) {
      where.country = country;
    }

    if (service) {
      where.servicesNeeded = {
        has: service,
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calculate pagination
    const skip = (page - 1) * limit;

    try {
      const [projects, total] = await Promise.all([
        this.prisma.project.findMany({
          where,
          include: {
            client: true,
            matches: {
              include: {
                vendor: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.project.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch projects');
    }
  }

  async findOne(id: string, userRole: UserRole, userClientId?: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        matches: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // If user is a client, they can only see their own projects
    if (userRole === UserRole.CLIENT && userClientId !== project.clientId) {
      throw new ForbiddenException('You can only access your own projects');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userRole: UserRole,
    userClientId?: string,
  ): Promise<Project> {
    // First check if project exists and user has access
    const existingProject = await this.findOne(id, userRole, userClientId);

    try {
      const project = await this.prisma.project.update({
        where: { id },
        data: {
          ...updateProjectDto,
          ...(updateProjectDto.servicesNeeded && {
            servicesNeeded: updateProjectDto.servicesNeeded,
          }),
        },
        include: {
          client: true,
          matches: {
            include: {
              vendor: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      throw new BadRequestException('Failed to update project');
    }
  }

  async remove(id: string, userRole: UserRole, userClientId?: string): Promise<void> {
    // First check if project exists and user has access
    await this.findOne(id, userRole, userClientId);

    try {
      await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete project');
    }
  }

  async updateStatus(id: string, status: ProjectStatus, userRole: UserRole, userClientId?: string): Promise<Project> {
    // First check if project exists and user has access
    await this.findOne(id, userRole, userClientId);

    try {
      const project = await this.prisma.project.update({
        where: { id },
        data: { status },
        include: {
          client: true,
          matches: {
            include: {
              vendor: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      throw new BadRequestException('Failed to update project status');
    }
  }

  async getProjectStats(userRole: UserRole, userClientId?: string) {
    const where: any = {};

    // If user is a client, they can only see stats for their own projects
    if (userRole === UserRole.CLIENT) {
      if (userClientId) {
        where.clientId = userClientId;
      } else {
        throw new ForbiddenException('Client ID not found in user context');
      }
    }

    try {
      const [
        totalProjects,
        projectsByStatus,
        projectsByCountry,
        totalBudget,
        averageBudget,
      ] = await Promise.all([
        this.prisma.project.count({ where }),
        this.prisma.project.groupBy({
          by: ['status'],
          where,
          _count: {
            status: true,
          },
        }),
        this.prisma.project.groupBy({
          by: ['country'],
          where,
          _count: {
            country: true,
          },
        }),
        this.prisma.project.aggregate({
          where,
          _sum: {
            budget: true,
          },
        }),
        this.prisma.project.aggregate({
          where,
          _avg: {
            budget: true,
          },
        }),
      ]);

      return {
        totalProjects,
        projectsByStatus: projectsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {} as Record<ProjectStatus, number>),
        projectsByCountry: projectsByCountry.reduce((acc, item) => {
          acc[item.country] = item._count.country;
          return acc;
        }, {} as Record<string, number>),
        totalBudget: totalBudget._sum.budget || 0,
        averageBudget: averageBudget._avg.budget || 0,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch project statistics');
    }
  }

  async getProjectsByClient(clientId: string, userRole: UserRole, userClientId?: string): Promise<Project[]> {
    // If user is a client, they can only see their own projects
    if (userRole === UserRole.CLIENT && userClientId !== clientId) {
      throw new ForbiddenException('You can only access your own projects');
    }

    const projects = await this.prisma.project.findMany({
      where: { clientId },
      include: {
        client: true,
        matches: {
          include: {
            vendor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
  }
}
