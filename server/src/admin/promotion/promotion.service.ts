import { Injectable } from '@nestjs/common';
import { PromotionType } from '@prisma/client';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private prismaService: PrismaService) {}

  async getAllPromotions() {
    try {
      const promotions = await this.prismaService.promotions.findMany();
      return promotions;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getPromotionByType(type: PromotionType) {
    try {
      const promotions = await this.prismaService.promotions.findMany({
        where: {
          type,
        },
      });
      return promotions;
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

  async createNewPromotion(
    bookId: string,
    type: PromotionType,
    startDate: string,
    endDate: string,
  ) {
    try {
      const promotion = await this.prismaService.promotions.create({
        data: {
          bookId,
          type,
          startDate,
          endDate,
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
