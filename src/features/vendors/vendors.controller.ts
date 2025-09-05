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
import { VendorsService } from './vendors.service';
import { CreateVendorDto, UpdateVendorDto, VendorQueryDto, UpdateVendorRatingDto, VendorSearchQueryDto } from './dto/index';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Vendor } from '@prisma/client';

@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new vendor',
    description: 'Create a new vendor (Admin only)',
  })
  @ApiBody({ type: CreateVendorDto })
  @ApiResponse({
    status: 201,
    description: 'Vendor created successfully',
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
    description: 'Forbidden - Admin access required',
  })
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get all vendors',
    description: 'Retrieve vendors with pagination (Admin only)',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Vendors per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field', example: 'rating' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Vendors retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(@Query() queryDto: VendorQueryDto) {
    return this.vendorsService.findAll(queryDto);
  }

  @Get('search')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Search vendors',
    description: 'Search vendors by name (Admin only)',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Vendors per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field', example: 'rating' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Vendor search results retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async searchVendors(@Query() queryDto: VendorSearchQueryDto) {
    return this.vendorsService.searchVendors(queryDto.q, queryDto);
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get vendor statistics',
    description: 'Get comprehensive statistics about vendors (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getStats() {
    return this.vendorsService.getVendorStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vendor by ID',
    description: 'Retrieve a specific vendor by its ID',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async findOne(@Param('id') id: string): Promise<Vendor> {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update vendor',
    description: 'Update a vendor (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiBody({ type: UpdateVendorDto })
  @ApiResponse({
    status: 200,
    description: 'Vendor updated successfully',
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
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Patch(':id/rating')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update vendor rating',
    description: 'Update the rating of a vendor (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiBody({ type: UpdateVendorRatingDto })
  @ApiResponse({
    status: 200,
    description: 'Vendor rating updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid rating provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateVendorRatingDto,
  ): Promise<Vendor> {
    return this.vendorsService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete vendor',
    description: 'Delete a vendor (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({
    status: 204,
    description: 'Vendor deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(id);
  }
}
