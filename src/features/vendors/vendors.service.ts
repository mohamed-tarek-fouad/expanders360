import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVendorDto, UpdateVendorDto, VendorQueryDto, UpdateVendorRatingDto, VendorSearchQueryDto } from './dto/index';
import { Vendor } from '@prisma/client';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    try {
      const vendor = await this.prisma.vendor.create({
        data: {
          ...createVendorDto,
          countriesSupported: createVendorDto.countriesSupported,
          servicesOffered: createVendorDto.servicesOffered,
        },
        include: {
          matches: {
            include: {
              project: {
                include: {
                  client: true,
                },
              },
            },
          },
        },
      });

      return vendor;
    } catch {
      throw new BadRequestException('Failed to create vendor');
    }
  }

  async findAll(queryDto: VendorQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = queryDto;


    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calculate pagination
    const skip = (page - 1) * limit;

    try {
      const [vendors, total] = await Promise.all([
        this.prisma.vendor.findMany({
          include: {
            matches: {
              include: {
                project: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.vendor.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        vendors,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch {
      throw new BadRequestException('Failed to fetch vendors');
    }
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            project: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    // First check if vendor exists
    await this.findOne(id);

    try {
      const vendor = await this.prisma.vendor.update({
        where: { id },
        data: {
          ...updateVendorDto,
          ...(updateVendorDto.countriesSupported && {
            countriesSupported: updateVendorDto.countriesSupported,
          }),
          ...(updateVendorDto.servicesOffered && {
            servicesOffered: updateVendorDto.servicesOffered,
          }),
        },
        include: {
          matches: {
            include: {
              project: {
                include: {
                  client: true,
                },
              },
            },
          },
        },
      });

      return vendor;
    } catch {
      throw new BadRequestException('Failed to update vendor');
    }
  }

  async remove(id: string): Promise<void> {
    // First check if vendor exists
    await this.findOne(id);

    try {
      await this.prisma.vendor.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Failed to delete vendor');
    }
  }

  async updateRating(id: string, updateRatingDto: UpdateVendorRatingDto): Promise<Vendor> {
    // First check if vendor exists
    await this.findOne(id);

    try {
      const vendor = await this.prisma.vendor.update({
        where: { id },
        data: { rating: updateRatingDto.rating },
        include: {
          matches: {
            include: {
              project: {
                include: {
                  client: true,
                },
              },
            },
          },
        },
      });

      return vendor;
    } catch (error) {
      throw new BadRequestException('Failed to update vendor rating');
    }
  }

  async getVendorStats() {
    try {
      const [
        totalVendors,
        vendorsByCountry,
        vendorsByService,
        averageRating,
        averageSlaHours,
        topRatedVendors,
      ] = await Promise.all([
        this.prisma.vendor.count(),
        this.prisma.vendor.findMany({
          select: {
            countriesSupported: true,
          },
        }),
        this.prisma.vendor.findMany({
          select: {
            servicesOffered: true,
          },
        }),
        this.prisma.vendor.aggregate({
          _avg: {
            rating: true,
          },
        }),
        this.prisma.vendor.aggregate({
          _avg: {
            responseSlaHours: true,
          },
        }),
        this.prisma.vendor.findMany({
          orderBy: {
            rating: 'desc',
          },
          take: 5,
          select: {
            id: true,
            name: true,
            rating: true,
          },
        }),
      ]);

      // Process country statistics
      const countryStats: Record<string, number> = {};
      vendorsByCountry.forEach((vendor) => {
        const countries = vendor.countriesSupported as string[];
        if (countries && Array.isArray(countries)) {
          countries.forEach((country) => {
            countryStats[country] = (countryStats[country] || 0) + 1;
          });
        }
      });

      // Process service statistics
      const serviceStats: Record<string, number> = {};
      vendorsByService.forEach((vendor) => {
        const services = vendor.servicesOffered as string[];
        if (services && Array.isArray(services)) {
          services.forEach((service) => {
            serviceStats[service] = (serviceStats[service] || 0) + 1;
          });
        }
      });

      return {
        totalVendors,
        averageRating: averageRating._avg.rating || 0,
        averageSlaHours: averageSlaHours._avg.responseSlaHours || 0,
        topRatedVendors,
        vendorsByCountry: countryStats,
        vendorsByService: serviceStats,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor statistics');
    }
  }

  async searchVendors(searchTerm: string, queryDto: VendorSearchQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = queryDto;

    // Build where clause with search (simplified for MySQL JSON compatibility)
    const where: any = {
      name: { contains: searchTerm },
    };

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calculate pagination
    const skip = (page - 1) * limit;

    try {
      const [vendors, total] = await Promise.all([
        this.prisma.vendor.findMany({
          where,
          include: {
            matches: {
              include: {
                project: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.vendor.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        vendors,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        searchTerm,
      };
    } catch(error) {
      console.error(error);
      throw new BadRequestException('Failed to search vendors');
    }
  }
}
