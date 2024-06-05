import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { BookService } from './book.service';

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
});
