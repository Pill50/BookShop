import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { PromotionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PromotionDto } from './dto/promotion.dto';

describe('PromotionService', () => {
  let service: PromotionService;
  let prismaServiceMock: {
    promotions: {
      findMany: jest.Mock<any, any>;
      count: jest.Mock<any, any>;
      findFirst: jest.Mock<any, any>;
      findUnique: jest.Mock<any, any>;
      create: jest.Mock<any, any>;
      delete: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
    };
    books: {
      findMany: jest.Mock<any, any>;
      findFirst: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      promotions: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
      books: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOnSaleItems', () => {
    it('should return on sale items with pagination', async () => {
      const pageIndex = 1;
      const take = 10;
      const skip = 0;
      const promotionsMock = [{ id: '1', book: { title: 'Book 1' } }];
      const totalRecordMock = 1;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.promotions.findMany.mockResolvedValueOnce(
        promotionsMock,
      );
      prismaServiceMock.promotions.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllOnSaleItems(pageIndex);

      expect(result).toEqual({
        promotions: promotionsMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.promotions.findMany).toHaveBeenCalledWith({
        skip,
        take,
        where: {},
        include: {
          book: {
            select: {
              title: true,
              thumbnail: true,
              description: true,
              author: true,
              publisher: true,
            },
          },
        },
      });
      expect(prismaServiceMock.promotions.count).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should filter on sale items by type', async () => {
      const pageIndex = 1;
      const type = PromotionType.SALE;
      const take = 10;
      const skip = 0;
      const promotionsMock = [{ id: '1', book: { title: 'Book 1' } }];
      const totalRecordMock = 1;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.promotions.findMany.mockResolvedValueOnce(
        promotionsMock,
      );
      prismaServiceMock.promotions.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllOnSaleItems(pageIndex, type);

      expect(result).toEqual({
        promotions: promotionsMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.promotions.findMany).toHaveBeenCalledWith({
        skip,
        take,
        where: { type },
        include: {
          book: {
            select: {
              title: true,
              thumbnail: true,
              description: true,
              author: true,
              publisher: true,
            },
          },
        },
      });
      expect(prismaServiceMock.promotions.count).toHaveBeenCalledWith({
        where: { type },
      });
    });

    it('should handle errors when querying on sale items', async () => {
      const pageIndex = 1;
      const errorMock = new Error('Failed to fetch on sale items');

      prismaServiceMock.promotions.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getAllOnSaleItems(pageIndex)).rejects.toThrow(
        errorMock,
      );
    });
  });

  describe('getPopularList', () => {
    it('should return a list of popular books', async () => {
      const popularBooksMock = [{ id: '1', title: 'Book 1' }];

      prismaServiceMock.books.findMany.mockResolvedValueOnce(popularBooksMock);

      const result = await service.getPopularList();

      expect(result).toEqual(popularBooksMock);
      expect(prismaServiceMock.books.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: false,
        },
        take: 10,
        orderBy: {
          soldNumber: 'desc',
        },
      });
    });

    it('should handle errors when fetching popular books', async () => {
      const errorMock = new Error('Failed to fetch popular books');

      prismaServiceMock.books.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getPopularList()).rejects.toThrow(errorMock);
    });
  });

  describe('getRecommendList', () => {
    it('should return a list of recommended books', async () => {
      const recommendBooksMock = [{ id: '1', title: 'Book 1' }];

      prismaServiceMock.books.findMany.mockResolvedValueOnce(
        recommendBooksMock,
      );

      const result = await service.getRecommendList();

      expect(result).toEqual(recommendBooksMock);
      expect(prismaServiceMock.books.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: false,
        },
        take: 10,
        orderBy: {
          rating: 'desc',
        },
      });
    });

    it('should handle errors when fetching recommended books', async () => {
      const errorMock = new Error('Failed to fetch recommended books');

      prismaServiceMock.books.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getRecommendList()).rejects.toThrow(errorMock);
    });
  });

  describe('getStatisticPromotion', () => {
    it('should return promotion statistics', async () => {
      const onSaleCountMock = 5;
      const onSaleExpiredCountMock = 2;
      const mostRecommendItemMock = { id: '1', title: 'Book 1' };
      const mostPopularItemMock = { id: '2', title: 'Book 2' };
      const statisticPromotionMock = {
        totalPromotions: onSaleCountMock,
        mostRecommendItem: mostRecommendItemMock,
        mostPopularItem: mostPopularItemMock,
        onSale: onSaleCountMock,
        onSaleExpired: onSaleExpiredCountMock,
      };

      prismaServiceMock.promotions.count.mockResolvedValueOnce(onSaleCountMock);
      prismaServiceMock.promotions.count.mockResolvedValueOnce(
        onSaleExpiredCountMock,
      );
      prismaServiceMock.books.findFirst.mockResolvedValueOnce(
        mostRecommendItemMock,
      );
      prismaServiceMock.books.findFirst.mockResolvedValueOnce(
        mostPopularItemMock,
      );

      const result = await service.getStatisticPromotion();

      expect(result).toEqual(statisticPromotionMock);
    });

    it('should handle errors when fetching promotion statistics', async () => {
      const errorMock = new Error('Failed to fetch promotion statistics');

      prismaServiceMock.promotions.count.mockRejectedValueOnce(errorMock);

      await expect(service.getStatisticPromotion()).rejects.toThrow(errorMock);
    });
  });

  describe('getPromotionById', () => {
    it('should return a promotion by ID', async () => {
      const promotionMock = { id: '1', type: PromotionType.SALE };
      const id = '1';

      prismaServiceMock.promotions.findUnique.mockResolvedValueOnce(
        promotionMock,
      );

      const result = await service.getPromotionById(id);

      expect(result).toEqual(promotionMock);
      expect(prismaServiceMock.promotions.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should handle errors when fetching a promotion by ID', async () => {
      const id = '1';
      const errorMock = new Error('Failed to fetch promotion');

      prismaServiceMock.promotions.findUnique.mockRejectedValueOnce(errorMock);

      await expect(service.getPromotionById(id)).rejects.toThrow(errorMock);
    });
  });

  describe('createNewPromotion', () => {
    it('should create a new promotion', async () => {
      const bookId = '1';
      const promotionDto: PromotionDto = {
        discountFlashSale: 0.1,
        type: PromotionType.SALE,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
      const promotionMock = { id: '1', ...promotionDto };

      prismaServiceMock.promotions.create.mockResolvedValueOnce(promotionMock);

      const result = await service.createNewPromotion(bookId, promotionDto);

      expect(result).toEqual(promotionMock);
      expect(prismaServiceMock.promotions.create).toHaveBeenCalledWith({
        data: {
          bookId,
          discountFlashSale: promotionDto.discountFlashSale,
          type: promotionDto.type,
          startDate: promotionDto.startDate,
          endDate: promotionDto.endDate,
        },
      });
    });

    it('should handle errors when creating a new promotion', async () => {
      const bookId = '1';
      const promotionDto: PromotionDto = {
        discountFlashSale: 0.1,
        type: PromotionType.SALE,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
      const errorMock = new Error('Failed to create promotion');

      prismaServiceMock.promotions.create.mockRejectedValueOnce(errorMock);

      await expect(
        service.createNewPromotion(bookId, promotionDto),
      ).rejects.toThrow(errorMock);
    });
  });

  describe('deletePromotion', () => {
    it('should delete a promotion if it has not started yet', async () => {
      const id = '1';
      const promotionMock = {
        id: '1',
        startDate: new Date(Date.now() + 10000),
      };

      prismaServiceMock.promotions.findUnique.mockResolvedValueOnce(
        promotionMock,
      );

      await service.deletePromotion(id);

      expect(prismaServiceMock.promotions.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should handle errors when deleting a promotion', async () => {
      const id = '1';
      const errorMock = new Error('Failed to delete promotion');

      prismaServiceMock.promotions.findUnique.mockRejectedValueOnce(errorMock);

      await expect(service.deletePromotion(id)).rejects.toThrow(errorMock);
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion if it has not started yet', async () => {
      const id = '1';
      const type = PromotionType.SALE;
      const startDate = new Date().toISOString();
      const endDate = new Date().toISOString();
      const promotionMock = { id: '1', startDate: new Date(Date.now() + 1000) };
      prismaServiceMock.promotions.findUnique.mockResolvedValueOnce(
        promotionMock,
      );
      prismaServiceMock.promotions.update.mockResolvedValueOnce(promotionMock);

      const result = await service.updatePromotion(
        id,
        type,
        startDate,
        endDate,
      );

      expect(result).toEqual(promotionMock);
      expect(prismaServiceMock.promotions.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          type,
          startDate,
          endDate,
        },
      });
    });

    it('should return null if the promotion has already started', async () => {
      const id = '1';
      const type = PromotionType.SALE;
      const startDate = new Date(Date.now() - 1000);
      const endDate = new Date();

      const result = await service.updatePromotion(
        id,
        type,
        startDate.toISOString(),
        endDate.toISOString(),
      );

      expect(result).toBeNull();
      expect(prismaServiceMock.promotions.update).not.toHaveBeenCalled();
    });
  });
});
