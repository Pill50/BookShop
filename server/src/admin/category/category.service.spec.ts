import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HttpException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let prismaServiceMock: {
    categories: {
      findMany: jest.Mock<any, any>;
      findFirst: jest.Mock<any, any>;
      findUnique: jest.Mock<any, any>;
      create: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
      delete: jest.Mock<any, any>;
      count: jest.Mock<any, any>;
    };
  };
  let cloudinaryServiceMock: {
    uploadFile: jest.Mock<any, any>;
    deleteFile: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    prismaServiceMock = {
      categories: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    cloudinaryServiceMock = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories with pagination', async () => {
      const pageIndex = 1;
      const take = 10;
      const skip = 0;
      const categoriesMock = [{ id: '1', title: 'Category 1' }];
      const totalRecordMock = 1;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.categories.findMany.mockResolvedValueOnce(
        categoriesMock,
      );
      prismaServiceMock.categories.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllCategories(pageIndex);

      expect(result).toEqual({
        categories: categoriesMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.categories.findMany).toHaveBeenCalledWith({
        skip,
        take,
      });
      expect(prismaServiceMock.categories.count).toHaveBeenCalled();
    });

    it('should handle errors when querying categories', async () => {
      const pageIndex = 1;
      const errorMock = new Error('Failed to fetch categories');

      prismaServiceMock.categories.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getAllCategories(pageIndex)).rejects.toThrow(
        errorMock,
      );
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const title = 'Test Category';
      const newCategoryMock = { id: '1', title };

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(null);
      prismaServiceMock.categories.create.mockResolvedValueOnce(
        newCategoryMock,
      );

      const result = await service.createCategory(title);

      expect(result).toEqual(newCategoryMock);
      expect(prismaServiceMock.categories.findFirst).toHaveBeenCalledWith({
        where: { title },
      });
      expect(prismaServiceMock.categories.create).toHaveBeenCalledWith({
        data: { title, thumbnail: process.env.DEFAULT_CATEGORY_IMAGE },
      });
    });

    it('should throw an error if the category already exists', async () => {
      const title = 'Test Category';

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce({
        id: '1',
        title,
      });

      await expect(service.createCategory(title)).rejects.toThrow();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const id = '1';
      const title = 'Updated Test Category';
      const thumbnail = null;
      const updatedCategoryMock = { id, title, thumbnail };

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce({ id });
      prismaServiceMock.categories.update.mockResolvedValueOnce(
        updatedCategoryMock,
      );

      const result = await service.updateCategory(id, title, thumbnail);

      expect(result).toEqual(updatedCategoryMock);
      expect(prismaServiceMock.categories.findFirst).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaServiceMock.categories.update).toHaveBeenCalledWith({
        where: { id },
        data: { title, thumbnail: process.env.DEFAULT_CATEGORY_IMAGE },
      });
    });

    it('should throw an error if the category to update does not exist', async () => {
      const id = '2';
      const title = 'Updated Test Category';
      const thumbnail = null;

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.updateCategory(id, title, thumbnail),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const id = '1';

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce({ id });

      await service.deleteCategory(id);

      expect(prismaServiceMock.categories.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an error if the category to delete does not exist', async () => {
      const id = '1';

      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(null);

      await expect(service.deleteCategory(id)).rejects.toThrow();
    });
  });
});
