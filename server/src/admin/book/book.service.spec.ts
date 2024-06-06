import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HttpException } from '@nestjs/common';

describe('BookService', () => {
  let bookService: BookService;
  let prismaServiceMock: {
    books: {
      findFirst: jest.MockedFunction<any>;
      create: jest.MockedFunction<any>;
      update: jest.MockedFunction<any>;
    };
  };
  let cloudinaryServiceMock: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: {
            books: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    prismaServiceMock = module.get(PrismaService);
    cloudinaryServiceMock = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'New Book',
        slug: 'new-book',
        description: 'Description of the new book',
        price: 20,
        discount: 5,
        amount: 100,
        authorId: 'authorId',
        publisherId: 'publisherId',
        categories: ['categoryId1', 'categoryId2'],
      };

      const createdBookMock = {
        id: 'createdBookId',
        title: bookData.title,
        slug: bookData.slug,
        description: bookData.description,
        price: bookData.price,
        discount: bookData.discount,
        amount: bookData.amount,
        thumbnail: process.env.DEFAULT_BOOK_IMAGE,
        author: { name: 'Author' },
        publisher: { name: 'Publisher' },
        categories: [
          { categories: { title: 'Category 1' } },
          { categories: { title: 'Category 2' } },
        ],
      };

      prismaServiceMock.books.findFirst.mockResolvedValue(null);
      prismaServiceMock.books.create.mockResolvedValue(createdBookMock);

      const result = await bookService.createBook(bookData);

      expect(result).toEqual({ book: createdBookMock });
      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { title: bookData.title },
      });
      expect(prismaServiceMock.books.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: bookData.title,
          description: bookData.description,
          price: bookData.price,
          discount: bookData.discount,
          amount: bookData.amount,
          thumbnail: process.env.DEFAULT_BOOK_IMAGE,
          author: { connect: { id: 'authorId' } },
          publisher: { connect: { id: 'publisherId' } },
          categories: {
            create: [
              { categories: { connect: { id: 'categoryId1' } } },
              { categories: { connect: { id: 'categoryId2' } } },
            ],
          },
        }),
        include: expect.anything(),
      });
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const bookData = {
        title: 'New Book',
        slug: 'new-book',
        description: 'Description of the new book',
        price: 20,
        discount: 5,
        amount: 100,
        authorId: 'authorId',
        publisherId: 'publisherId',
        categories: ['categoryId1', 'categoryId2'],
      };

      const existingBookMock = {
        id: 'existingBookId',
        thumbnail: 'existing-thumbnail-url',
      };

      const updatedBookMock = {
        ...existingBookMock,
        ...bookData,
        author: { name: 'Updated Author' },
        publisher: { name: 'Updated Publisher' },
        categories: [
          { categories: { title: 'Category 1' } },
          { categories: { title: 'Category 2' } },
        ],
      };

      prismaServiceMock.books.findFirst.mockResolvedValue(existingBookMock);
      prismaServiceMock.books.update.mockResolvedValue(updatedBookMock);

      const result = await bookService.updateBook(
        'existingBookId',
        null,
        bookData,
      );

      expect(result).toEqual({ book: updatedBookMock });
      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { id: 'existingBookId' },
      });
      expect(prismaServiceMock.books.update).toHaveBeenCalledWith({
        where: { id: 'existingBookId' },
        data: expect.objectContaining({
          title: bookData.title,
          description: bookData.description,
          price: bookData.price,
          discount: bookData.discount,
          amount: bookData.amount,
          thumbnail: 'existing-thumbnail-url', // Because no new thumbnail was provided
          authorId: bookData.authorId,
          publisherId: bookData.publisherId,
        }),
        include: expect.anything(),
      });
    });

    it('should throw an error if the book is not found', async () => {
      prismaServiceMock.books.findFirst.mockResolvedValue(null);

      await expect(
        bookService.updateBook('nonExistentBookId', null, {} as any),
      ).rejects.toThrow(HttpException);

      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { id: 'nonExistentBookId' },
      });
      expect(prismaServiceMock.books.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    it('should mark a book as deleted', async () => {
      const existingBookMock = {
        id: 'existingBookId',
        isDeleted: false,
      };

      prismaServiceMock.books.findFirst.mockResolvedValue(existingBookMock);
      prismaServiceMock.books.update.mockResolvedValue({
        ...existingBookMock,
        isDeleted: true,
      });

      const result = await bookService.deleteBook('existingBookId');

      expect(result).toBeNull();
      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { id: 'existingBookId' },
      });
      expect(prismaServiceMock.books.update).toHaveBeenCalledWith({
        where: { id: 'existingBookId' },
        data: { isDeleted: true },
      });
    });

    it('should throw an error if the book is not found', async () => {
      prismaServiceMock.books.findFirst.mockResolvedValue(null);

      await expect(bookService.deleteBook('nonExistentBookId')).rejects.toThrow(
        HttpException,
      );

      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { id: 'nonExistentBookId' },
      });
      expect(prismaServiceMock.books.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the book is already deleted', async () => {
      const existingBookMock = {
        id: 'existingBookId',
        isDeleted: true,
      };

      prismaServiceMock.books.findFirst.mockResolvedValue(existingBookMock);

      await expect(bookService.deleteBook('existingBookId')).rejects.toThrow(
        HttpException,
      );

      expect(prismaServiceMock.books.findFirst).toHaveBeenCalledWith({
        where: { id: 'existingBookId' },
      });
      expect(prismaServiceMock.books.update).not.toHaveBeenCalled();
    });
  });
});
