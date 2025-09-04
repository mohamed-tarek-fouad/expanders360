import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  @ApiProperty({
    example: 'clx1234567890',
    description: 'User unique identifier'
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name'
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name'
  })
  lastName: string;

  @ApiProperty({
    example: UserRole.CLIENT,
    description: 'User role',
    enum: UserRole
  })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  accessToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User information'
  })
  user: UserResponseDto;
}

export class ProfileResponseDto extends UserResponseDto {
  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'User creation timestamp'
  })
  createdAt: Date;
}
