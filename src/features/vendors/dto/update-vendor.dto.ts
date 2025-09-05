import { IsString, IsArray, IsNumber, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVendorDto {
  @ApiProperty({
    example: 'Updated Digital Solutions Inc',
    description: 'Updated name of the vendor company',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: ['United States', 'Canada', 'Mexico', 'United Kingdom'],
    description: 'Updated array of countries the vendor supports',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countriesSupported?: string[];

  @ApiProperty({
    example: ['Web Development', 'Mobile App', 'UI/UX Design', 'E-commerce', 'Cloud Services'],
    description: 'Updated array of services offered by the vendor',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicesOffered?: string[];

  @ApiProperty({
    example: 4.85,
    description: 'Updated vendor rating from 0.00 to 5.00',
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    example: 12,
    description: 'Updated response SLA in hours',
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  responseSlaHours?: number;
}

export class VendorQueryDto {
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of vendors per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: 'rating',
    description: 'Field to sort by (name, rating, responseSlaHours, createdAt)',
    required: false,
    default: 'rating',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'rating';

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

export class UpdateVendorRatingDto {
  @ApiProperty({
    example: 4.85,
    description: 'New vendor rating from 0.00 to 5.00',
    minimum: 0,
    maximum: 5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

export class VendorSearchQueryDto {
  @ApiProperty({
    example: 'Digital',
    description: 'Search term for vendor name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of vendors per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: 'rating',
    description: 'Field to sort by (name, rating, responseSlaHours, createdAt)',
    required: false,
    default: 'rating',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'rating';

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
