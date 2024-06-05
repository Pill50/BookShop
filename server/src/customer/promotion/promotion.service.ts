import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async getAllOnSaleItems(pageIndex: number = 1, type?: PromotionType) {
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

  async getPopularList() {
    try {
      const popularList = await this.prismaService.books.findMany({
        where: {
          isDeleted: false,
        },
        take: 10,
        orderBy: {
          soldNumber: 'desc',
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          author: true,
          publisher: true,
          description: true,
          soldNumber: true,
        },
      });

      return popularList;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getRecommendList() {
    try {
      const recommendList = await this.prismaService.books.findMany({
        take: 10,
        where: {
          isDeleted: false,
        },
        orderBy: {
          rating: 'desc',
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          author: true,
          publisher: true,
          rating: true,
          description: true,
          soldNumber: true,
        },
      });

      return recommendList;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async findExpiredPromotions() {
    try {
      const expiredPromotions = await this.prismaService.promotions.findMany({
        where: {
          endDate: {
            lt: new Date(),
          },
        },
      });
      return expiredPromotions;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deletePromotions(id: string) {
    try {
      const promotion = await this.prismaService.promotions.findUnique({
        where: {
          id,
        },
      });

      if (!promotion)
        throw new HttpException('Promotion not found', HttpStatus.BAD_REQUEST);

      await this.prismaService.promotions.delete({
        where: {
          id,
        },
      });

      return null;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
