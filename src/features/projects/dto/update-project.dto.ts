import { IsString, IsArray, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Canada',
    description: 'Updated country where the project will be executed',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: ['Web Development', 'Mobile App', 'UI/UX Design', 'Cloud Services'],
    description: 'Updated array of services needed for this project',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicesNeeded?: string[];

  @ApiProperty({
    example: 75000.00,
    description: 'Updated project budget in USD',
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiProperty({
    example: ProjectStatus.ACTIVE,
    description: 'Updated status of the project',
    enum: ProjectStatus,
    required: false,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}

export class ProjectQueryDto {
  @ApiProperty({
    example: 'clx1234567890',
    description: 'Filter by client ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    example: ProjectStatus.ACTIVE,
    description: 'Filter by project status',
    enum: ProjectStatus,
    required: false,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiProperty({
    example: 'United States',
    description: 'Filter by country',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: 'Web Development',
    description: 'Filter by service needed',
    required: false,
  })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of projects per page',
    required: false,
    default: 10,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    example: 'createdAt',
    description: 'Field to sort by (createdAt, updatedAt, budget)',
    required: false,
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    example: 'desc',
    description: 'Sort order (asc or desc)',
    required: false,
    default: 'desc',
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
