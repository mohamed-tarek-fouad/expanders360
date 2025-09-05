import { IsString, IsNotEmpty, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({
    example: 'Digital Solutions Inc',
    description: 'Name of the vendor company',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['United States', 'Canada', 'Mexico'],
    description: 'Array of countries the vendor supports',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  countriesSupported: string[];

  @ApiProperty({
    example: ['Web Development', 'Mobile App', 'UI/UX Design', 'E-commerce'],
    description: 'Array of services offered by the vendor',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  servicesOffered: string[];

  @ApiProperty({
    example: 4.75,
    description: 'Vendor rating from 0.00 to 5.00',
    minimum: 0,
    maximum: 5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 24,
    description: 'Response SLA in hours',
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  responseSlaHours: number;
}
