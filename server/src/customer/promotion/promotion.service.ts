import { Injectable } from '@nestjs/common';
import { PromotionType } from '@prisma/client';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotionDto } from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private prismaService: PrismaService) {}

  private formatPromotion(promotion: any): any {
    const { type, discountFlashSale } = promotion;
    const { book } = promotion;

    if (type === PromotionType.SALE) {
      book.discount = discountFlashSale;
    }

    return {
      id: promotion.id,
      type: promotion.type,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      book,
    };
  }

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

      console.log(promotions);
      const formattedPromotions = promotions.map((promotion) =>
        this.formatPromotion(promotion),
      );

      return {
        promotions: formattedPromotions,
        totalPage,
        totalRecord,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
