import { Injectable } from '@nestjs/common';
import { PromotionType } from '@prisma/client';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotionDto } from './dto/promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private prismaService: PrismaService) {}

  async getAllOnSaleItems(pageIndex: number = 1, type?: PromotionType) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const filter = type ? { type } : {};

      const [promotions, totalRecord] = await Promise.all([
        this.prismaService.promotions.findMany({
          skip,
          take,
          where: filter,
          include: {
            book: {
              select: {
                title: true,
                thumbnail: true,
                description: true,
                author: true,
                publisher: true
              },
            },
          },
        }),
        this.prismaService.promotions.count({
          where: filter,
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

  async getPopularList() {
    try {
      const popularList = await this.prismaService.books.findMany({
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
          isDeleted: false
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

  async getStatisticPromotion() {
    try {
      const onSale = await this.prismaService.promotions.count({
        where: {
          type: 'SALE',
        },
      });

      const onSaleExpired = await this.prismaService.promotions.count({
        where: {
          endDate: {
            lte: new Date(),
          },
        },
      });

      const statisticPromotion = {
        totalPromotions: onSale,
        onSale,
        onSaleExpired,
      };

      return statisticPromotion;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getPromotionById(id: string) {
    try {
      const promotions = await this.prismaService.promotions.findMany({
        where: {
          id,
        },
      });
      return promotions;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createNewPromotion(bookId: string, data: PromotionDto) {
    try {
      const promotion = await this.prismaService.promotions.create({
        data: {
          bookId,
          discountFlashSale: data.discountFlashSale,
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });

      return promotion;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deletePromotion(id: string) {
    try {
      const promotions = await this.prismaService.promotions.delete({
        where: {
          id,
        },
      });
      return promotions;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updatePromotion(
    id: string,
    type: PromotionType,
    startDate: string,
    endDate: string,
  ) {
    try {
      const promotions = await this.prismaService.promotions.update({
        where: {
          id,
        },
        data: {
          type,
          startDate,
          endDate,
        },
      });
      return promotions;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
