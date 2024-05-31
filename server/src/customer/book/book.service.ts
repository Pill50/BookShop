import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookError, exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  private calculateDiscount(book: any): number {
    let discount = book.discount;
    if (book.promotions && book.promotions.length > 0) {
      book.promotions.forEach((promotion) => {
        if (promotion.discountFlashSale > discount) {
          discount = promotion.discount;
        }
      });
    }

    return discount;
  }

  async getAllBooks(
    pageIndex: number,
    rating: number,
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

      if (rating) {
        baseFilter.AND = {
          rating: {
            gte: rating,
          },
          AND: {
            rating: {
              lt: rating + 1,
            },
          },
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
          rating: true,
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
          promotions: {
            where: {
              type: 'SALE',
              startDate: {
                lte: new Date(),
              },
              endDate: {
                gte: new Date(),
              },
            },
            select: {
              type: true,
              discountFlashSale: true,
            },
          },
        },
      });

      const formattedBooks = books.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
        discount: this.calculateDiscount(book),
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
          promotions: {
            where: {
              type: 'SALE',
              startDate: {
                lte: new Date(),
              },
              endDate: {
                gte: new Date(),
              },
            },
            select: {
              type: true,
              discountFlashSale: true,
            },
          },
        },
      });

      const formattedBooks = books.map((book) => ({
        ...book,
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
        discount: this.calculateDiscount(book),
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
        discount: this.calculateDiscount(book),
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

      const subImgList = await this.prismaService.bookImages.findMany({
        where: {
          bookId: book.id,
        },
      });

      const formattedBook = {
        ...book,
        discount: this.calculateDiscount(book),
        categories: book.categories.map((category) => ({
          id: category.categories.id,
          title: category.categories.title,
        })),
        subImgList: subImgList,
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

      const formattedBooks = bookList.map((book) => ({
        ...book,
        discount: this.calculateDiscount(book),
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

      const formattedBooks = bookList.map((book) => ({
        ...book,
        discount: this.calculateDiscount(book),
        categories: book.categories.map(
          (category) => category.categories.title,
        ),
      }));

      return formattedBooks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getStatistics() {
    try {
      const users = await this.prismaService.users.count();
      const books = await this.prismaService.books.count();
      const feedbacks = await this.prismaService.feedbacks.count();
      const categories = await this.prismaService.categories.count();
      const shippers = await this.prismaService.shippers.count();
      const promotions = await this.prismaService.promotions.count();

      return {
        users,
        books,
        feedbacks,
        categories,
        shippers,
        promotions,
      };
    } catch (err) {
      throw exceptionHandler(err);
    }
  }
}
