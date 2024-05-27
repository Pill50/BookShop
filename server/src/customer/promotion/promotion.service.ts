import { Injectable } from '@nestjs/common';
import { PromotionType } from '@prisma/client';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotionDto } from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private prismaService: PrismaService) {}

  async filterPromotions(pageIndex: number = 1, type?: PromotionType) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const baseFilter = {
        AND: [
          type ? { type } : {},
          {
            endDate: {
              gte: new Date(),
            },
          },
          {
            book: {
              isDeleted: false,
            },
          },
        ],
      };

      const [promotions, totalRecord] = await Promise.all([
        this.prismaService.promotions.findMany({
          skip,
          take,
          where: baseFilter,
          include: {
            book: true,
          },
        }),
        this.prismaService.promotions.count({
          where: baseFilter,
        }),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        promotions,
        totalPage,
        totalRecord,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
