import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotionType } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

describe('PromotionService', () => {
  let service: PromotionService;
  let prismaService: PrismaService;
  let promotion = {
    id: 'promo_1',
    bookId: 'book_1',
    type: PromotionType.SALE,
    discountFlashSale: 30,
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let book = {
    id: 'book_1',
    title: 'Book 1',
    authorId: 'author_1',
    publisherId: 'publisher_1',
    slug: 'slug',
    price: 10000,
    rating: 5,
    discount: 5,
    amount: 10,
    isDeleted: false,
    thumbnail: 'thumbnail.jpg',
    author: 'Author 1',
    publisher: 'Publisher 1',
    description: 'Description 1',
    soldNumber: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        {
          provide: PrismaService,
          useValue: {
            promotions: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            books: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOnSaleItems', () => {
    it('should return paginated promotions', async () => {
      const totalRecord = 1;

      jest
        .spyOn(prismaService.promotions, 'findMany')
        .mockResolvedValueOnce([promotion]);
      jest
        .spyOn(prismaService.promotions, 'count')
        .mockResolvedValueOnce(totalRecord);

      const result = await service.getAllOnSaleItems(1, PromotionType.SALE);

      expect(result.promotions).toHaveLength(1);
      expect(result.totalPage).toBe(1);
      expect(result.totalRecord).toBe(totalRecord);
      expect(prismaService.promotions.findMany).toHaveBeenCalled();
      expect(prismaService.promotions.count).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest
        .spyOn(prismaService.promotions, 'findMany')
        .mockRejectedValueOnce(error);
      await expect(service.getAllOnSaleItems()).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });

  describe('getPopularList', () => {
    it('should return popular book list', async () => {
      jest.spyOn(prismaService.books, 'findMany').mockResolvedValueOnce([book]);

      const result = await service.getPopularList();

      expect(result).toEqual([book]);
      expect(prismaService.books.findMany).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest.spyOn(prismaService.books, 'findMany').mockRejectedValueOnce(error);
      await expect(service.getPopularList()).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });

  describe('getRecommendList', () => {
    it('should return recommended book list', async () => {
      jest.spyOn(prismaService.books, 'findMany').mockResolvedValueOnce([book]);

      const result = await service.getRecommendList();

      expect(result).toEqual([book]);
      expect(prismaService.books.findMany).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest.spyOn(prismaService.books, 'findMany').mockRejectedValueOnce(error);
      await expect(service.getRecommendList()).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });

  describe('findExpiredPromotions', () => {
    it('should return a list of expired promotions', async () => {
      const expiredPromotions = [
        {
          ...promotion,
          endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      ];

      jest
        .spyOn(prismaService.promotions, 'findMany')
        .mockResolvedValueOnce(expiredPromotions);

      const result = await service.findExpiredPromotions();

      expect(result).toEqual(expiredPromotions);
      expect(prismaService.promotions.findMany).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Database error');
      jest
        .spyOn(prismaService.promotions, 'findMany')
        .mockRejectedValueOnce(error);
      await expect(service.findExpiredPromotions()).rejects.toMatchObject({
        message: 'Database error',
      });
    });
  });

  describe('deletePromotions', () => {
    it('should delete a promotion successfully', async () => {
      jest
        .spyOn(prismaService.promotions, 'findUnique')
        .mockResolvedValueOnce(promotion);
      jest
        .spyOn(prismaService.promotions, 'delete')
        .mockResolvedValueOnce(null);

      const result = await service.deletePromotions('promo_1');

      expect(result).toBeNull();
      expect(prismaService.promotions.findUnique).toHaveBeenCalledWith({
        where: { id: 'promo_1' },
      });
      expect(prismaService.promotions.delete).toHaveBeenCalledWith({
        where: { id: 'promo_1' },
      });
    });

    it('should throw an error if promotion not found', async () => {
      jest
        .spyOn(prismaService.promotions, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.deletePromotions('promo_2')).rejects.toMatchObject({
        response: 'Promotion not found',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Database error');
      jest
        .spyOn(prismaService.promotions, 'findUnique')
        .mockRejectedValueOnce(error);
      await expect(service.deletePromotions('promo_1')).rejects.toMatchObject({
        message: 'Database error',
      });
    });
  });
});
