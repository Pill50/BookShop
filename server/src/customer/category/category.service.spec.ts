import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from './category.service';
import { AppModule } from 'src/app.module';
import { HttpException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let prismaService: PrismaService;
  const categoryResponse = [
    {
      id: '1',
      title: 'category 1',
      thumbnail:
        'https://res.cloudinary.com/dnexchfxr/image/upload/v1713840770/samples/ecommerce/leather-bag-gray.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            categories: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should get all categories successfully', async () => {
      jest
        .spyOn(prismaService.categories, 'findMany')
        .mockResolvedValueOnce(categoryResponse);

      const result = await service.getAllCategories();

      expect(result).toBe(categoryResponse);
      expect(prismaService.categories.findMany).toHaveBeenCalled();
    });

    it('should return an empty array when no categories exist', async () => {
      jest
        .spyOn(prismaService.categories, 'findMany')
        .mockResolvedValueOnce([]);

      const result = await service.getAllCategories();

      expect(result).toEqual([]);
      expect(prismaService.categories.findMany).toHaveBeenCalled();
    });
  });
});
