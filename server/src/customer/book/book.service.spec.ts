import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { BookService } from './book.service';
import { BookError } from 'src/common/errors';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let prismaService: PrismaService;
  let bookResponse = {
    id: '1',
    title: 'title',
    slug: 'title-1',
    description: 'description',
    rating: 4.5,
    price: 19900,
    thumbnail:
      'https://res.cloudinary.com/dnexchfxr/image/upload/v1717149106/Nestjs/pbvhoespc3asdqspp2l7.png',
    amount: 93,
    discount: 10,
    soldNumber: 50,
    authorId: 'author_1',
    author: {
      name: 'author',
      id: 'author_1',
    },
    publisherId: 'publisher_1',
    publisher: {
      name: 'publisher',
      id: 'publisher_1',
    },
    categories: [
      {
        categories: {
          title: 'category_1',
        },
      },
      {
        categories: {
          title: 'category_2',
        },
      },
      {
        categories: {
          title: 'category_3',
        },
      },
    ],
    feedbacks: [],
    promotions: [],
    bookImages: [],
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: {
            books: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return formatted books with pagination and sorting', async () => {
      const pageIndex = 1;
      const rating = 4;
      const keyword = 'title';
      const publisherId = ['publisher_1'];
      const categories = ['category_1', 'category_2'];
      const sortByPrice = 'asc';
      const sortBySoldAmount = 'desc';
      const sortByDate = 'desc';

      jest.spyOn(prismaService.books, 'count').mockResolvedValueOnce(1);
      jest
        .spyOn(prismaService.books, 'findMany')
        .mockResolvedValueOnce([bookResponse]);

      const result = await service.getAllBooks(
        pageIndex,
        rating,
        keyword,
        publisherId,
        categories,
        sortByPrice,
        sortBySoldAmount,
        sortByDate,
      );

      // Assertions
      expect(result.totalPage).toEqual(1);
      expect(result.totalRecord).toEqual(1);
      expect(result.books).toHaveLength(1);

      expect(result.books[0]).toHaveProperty('title', 'title');
      expect(result.books[0]).toHaveProperty('discount');
      expect(prismaService.books.count).toHaveBeenCalledWith({
        where: expect.objectContaining({}),
      });
      expect(prismaService.books.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({}),
        skip: 0,
        take: 10,
        orderBy: expect.arrayContaining([
          { createdAt: 'desc' },
          { price: 'asc' },
          { soldNumber: 'desc' },
        ]),
        select: expect.any(Object),
      });
    });
  });

  describe('getBookById', () => {
    it('should return formatted book by id', async () => {
      const bookId = '1';

      jest
        .spyOn(prismaService.books, 'findFirst')
        .mockResolvedValueOnce(bookResponse);

      const result = await service.getBookById(bookId);

      expect(result).toHaveProperty('title', 'title');
      expect(result).toHaveProperty('discount');
      expect(result.categories).toHaveLength(3);
      expect(prismaService.books.findFirst).toHaveBeenCalledWith({
        where: { id: bookId },
        include: expect.any(Object),
      });
    });

    it('should throw BOOK_NOT_FOUND error if book does not exist', async () => {
      const bookId = '2';

      jest.spyOn(prismaService.books, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.getBookById(bookId)).rejects.toThrow(HttpException);
    });
  });

  describe('getBookBySlug', () => {
    it('should return formatted book by slug', async () => {
      const slug = 'title-1';

      jest
        .spyOn(prismaService.books, 'findFirst')
        .mockResolvedValueOnce(bookResponse);
      jest
        .spyOn(prismaService.bookImages, 'findMany')
        .mockResolvedValueOnce([]);

      const result = await service.getBookBySlug(slug);

      expect(result.book).toHaveProperty('title', 'title');
      expect(result.book).toHaveProperty('discount');
      expect(prismaService.books.findFirst).toHaveBeenCalledWith({
        where: { slug: slug },
        include: expect.any(Object),
      });
    });

    it('should throw BOOK_NOT_FOUND error if book does not exist', async () => {
      const slug = 'nonexistent-slug';

      jest.spyOn(prismaService.books, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.getBookBySlug(slug)).rejects.toThrow(HttpException);
    });
  });

  describe('getTop10BestSeller', () => {
    it('should return top 10 best seller books', async () => {
      jest
        .spyOn(prismaService.books, 'findMany')
        .mockResolvedValueOnce([bookResponse]);

      const result = await service.getTop10BestSeller();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('title', 'title');
      expect(result[0]).toHaveProperty('discount');
      expect(prismaService.books.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { soldNumber: 'desc' },
        take: 10,
        include: expect.any(Object),
      });
    });
  });

  describe('getTop10Newest', () => {
    it('should return top 10 newest books', async () => {
      jest
        .spyOn(prismaService.books, 'findMany')
        .mockResolvedValueOnce([bookResponse]);

      const result = await service.getTop10Newest();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('title', 'title');
      expect(result[0]).toHaveProperty('discount');
      expect(prismaService.books.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: expect.any(Object),
      });
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', async () => {
      const stats = {
        users: 100,
        books: 200,
        feedbacks: 300,
        categories: 50,
        shippers: 20,
        promotions: 10,
      };

      jest
        .spyOn(prismaService.users, 'count')
        .mockResolvedValueOnce(stats.users);
      jest
        .spyOn(prismaService.books, 'count')
        .mockResolvedValueOnce(stats.books);
      jest
        .spyOn(prismaService.feedbacks, 'count')
        .mockResolvedValueOnce(stats.feedbacks);
      jest
        .spyOn(prismaService.categories, 'count')
        .mockResolvedValueOnce(stats.categories);
      jest
        .spyOn(prismaService.shippers, 'count')
        .mockResolvedValueOnce(stats.shippers);
      jest
        .spyOn(prismaService.promotions, 'count')
        .mockResolvedValueOnce(stats.promotions);

      const result = await service.getStatistics();

      expect(result).toEqual(stats);
      expect(prismaService.users.count).toHaveBeenCalled();
      expect(prismaService.books.count).toHaveBeenCalled();
      expect(prismaService.feedbacks.count).toHaveBeenCalled();
      expect(prismaService.categories.count).toHaveBeenCalled();
      expect(prismaService.shippers.count).toHaveBeenCalled();
      expect(prismaService.promotions.count).toHaveBeenCalled();
    });
  });
});
