// src/common/services/pagination.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) {}

  async paginate(
    model: any,
    page: number | string = 1,
    limit: number | string = 10,
    query: string = '',
    searchFields: string[] = [],
    where: any = {},
    orderBy: any = { id: 'asc' },
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let searchWhere = {};
    if (query && searchFields.length > 0) {
      searchWhere = {
        OR: searchFields.map((field) => ({
          [field]: { contains: query },
        })),
      };
    }

    const finalWhere = { ...where, ...searchWhere };

    const [data, total] = await Promise.all([
      this.prisma[model].findMany({
        skip,
        take: limitNumber,
        where: finalWhere,
        orderBy,
      }),
      this.prisma[model].count({ where: finalWhere }),
    ]);

    const lastPage = Math.ceil(total / limitNumber);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        lastPage,
        limit: limitNumber,
      },
    };
  }
}
