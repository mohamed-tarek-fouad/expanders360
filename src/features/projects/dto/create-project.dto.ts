import { IsString, IsNotEmpty, IsArray, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({
    example: 'clx1234567890',
    description: 'ID of the client who owns this project',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    example: 'United States',
    description: 'Country where the project will be executed',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: ['Web Development', 'Mobile App', 'UI/UX Design'],
    description: 'Array of services needed for this project',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  servicesNeeded: string[];

  @ApiProperty({
    example: 50000.00,
    description: 'Project budget in USD',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    example: ProjectStatus.DRAFT,
    description: 'Initial status of the project',
    enum: ProjectStatus,
    required: false,
    default: ProjectStatus.DRAFT,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus = ProjectStatus.DRAFT;
}
