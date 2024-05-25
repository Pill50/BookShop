import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BookError, exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookDto } from './dto/book.dto';
import { generateUniqueSlug } from 'src/utils/helper';
@Injectable()
export class BookService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAllBooks(
    pageIndex: number,
    keyword: string,
    publisherId: string[],
    categories: string[],
    sortByPrice: string,
    sortBySoldAmount: string,
    sortByDate: string,
  ) {
    try {
      // Filter where condition with (keyword, category)
      let baseFilter: any = {
        isDeleted: false,
      };
      if (keyword) {
        baseFilter.title = {
          contains: keyword,
        };
      }

      if (categories && categories.length > 0) {
        baseFilter.categories = {
          some: {
            categoryId: {
              in: categories,
            },
          },
        };
      }

      if (publisherId && publisherId.length > 0) {
        baseFilter.publisherId = {
          in: publisherId,
        };
      }

      // PAGINATION
      const totalRecord = await this.prismaService.books.count({
        where: baseFilter,
      });
      const take = 10;
      const skip = ((pageIndex ?? 1) - 1) * take;
      const totalPage = Math.ceil(totalRecord / take);

      // SORTBY
      const orderBy: any[] = [];

      if (sortByDate === 'desc' || sortByDate === 'asc') {
        orderBy.push({
          createdAt: sortByDate,
        });
      }

      if (sortByPrice === 'desc' || sortByPrice === 'asc') {
        orderBy.push({
          price: sortByPrice,
        });
      }

      if (sortBySoldAmount === 'desc' || sortBySoldAmount === 'asc') {
        orderBy.push({
          soldNumber: sortBySoldAmount,
        });
      }

      const books = await this.prismaService.books.findMany({
        where: baseFilter,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          thumbnail: true,
          amount: true,
          discount: true,
          soldNumber: true,
          author: {
            select: {
              name: true,
              id: true,
            },
          },
          publisher: {
            select: {
              name: true,
              id: true,
            },
          },
          categories: {
            include: {
              categories: true,
            },
          },
        },
      });

      const formattedBooks = books.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
      }));

      return { totalPage, totalRecord, books: formattedBooks };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async getRelatedBooks(categories: string[]) {
    try {
      // Filter where condition with (keyword, category)
      let baseFilter: any = {
        isDeleted: false,
      };

      if (categories && categories.length > 0) {
        baseFilter.categories = {
          some: {
            categoryId: {
              in: categories,
            },
          },
        };
      }

      const books = await this.prismaService.books.findMany({
        where: baseFilter,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          thumbnail: true,
          amount: true,
          discount: true,
          soldNumber: true,
          author: {
            select: {
              name: true,
              id: true,
            },
          },
          publisher: {
            select: {
              name: true,
              id: true,
            },
          },
          categories: {
            include: {
              categories: true,
            },
          },
        },
      });

      const formattedBooks = books.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
      }));

      return { books: formattedBooks };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async getBookById(id: string) {
    try {
      const book = await this.prismaService.books.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          author: {
            select: {
              name: true,
              id: true,
            },
          },
          publisher: {
            select: {
              name: true,
              id: true,
            },
          },
          categories: {
            select: {
              categories: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          feedbacks: {
            include: {
              user: {
                select: {
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          promotions: {
            where: {
              endDate: {
                gte: new Date(),
              },
            },
            select: {
              type: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!book) {
        throw new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const formattedBook = {
        ...book,
        categories: book.categories.map((category) => ({
          id: category.categories.id,
          title: category.categories.title,
        })),
      };

      return formattedBook;
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async getBookBySlug(slug: string) {
    try {
      const book = await this.prismaService.books.findFirst({
        where: {
          slug: slug,
          isDeleted: false,
        },
        include: {
          author: {
            select: {
              name: true,
              id: true,
            },
          },
          publisher: {
            select: {
              name: true,
              id: true,
            },
          },
          categories: {
            select: {
              categories: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          feedbacks: {
            include: {
              user: {
                select: {
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          promotions: {
            where: {
              endDate: {
                gte: new Date(),
              },
            },
            select: {
              type: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!book) {
        throw new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const formattedBook = {
        ...book,
        categories: book.categories.map((category) => ({
          id: category.categories.id,
          title: category.categories.title,
        })),
      };

      return { book: formattedBook };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async getTop10BestSeller() {
    try {
      const bookList = await this.prismaService.books.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          soldNumber: 'desc',
        },
        take: 10,
        include: {
          author: {
            select: {
              name: true,
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              categories: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      const formattedBooks = bookList.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
      }));

      return formattedBooks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getTop10Newest() {
    try {
      const bookList = await this.prismaService.books.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        include: {
          author: {
            select: {
              name: true,
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              categories: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      const formattedBooks = bookList.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
      }));

      return formattedBooks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
