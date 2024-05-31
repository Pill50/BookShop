import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BookError, exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateUniqueSlug } from 'src/utils/helper';
import { BookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private formatBookWithPromotion(book: any, now: Date) {
    const activePromotion = book.promotions.find((promotion) => {
      return (
        promotion.type === 'SALE' &&
        new Date(promotion.startDate) <= now &&
        now <= new Date(promotion.endDate)
      );
    });

    if (activePromotion) {
      book.discount = activePromotion.discountFlashSale;
    }

    return {
      ...book,
      categories: book.categories.map((category) => category.categories.title),
    };
  }

  async getAllBooks(
    pageIndex: number = 1,
    keyword?: string,
    publisherId?: string[],
    categories?: string[],
    sortByPrice?: string,
    sortBySoldAmount?: string,
    sortByDate?: string,
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
          promotions: {
            select: {
              type: true,
              discountFlashSale: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      const now = new Date();

      const formattedBooks = books.map((book) =>
        this.formatBookWithPromotion(book, now),
      );

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
            select: {
              type: true,
              discountFlashSale: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      const now = new Date();

      const formattedBooks = books.map((book) =>
        this.formatBookWithPromotion(book, now),
      );

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
          promotions: {
            select: {
              type: true,
              startDate: true,
              endDate: true,
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
        },
      });

      if (!book) {
        throw new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const now = new Date();

      const formattedBook = this.formatBookWithPromotion(book, now);

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
            select: {
              type: true,
              discountFlashSale: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!book) {
        throw new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const now = new Date();

      const formattedBook = this.formatBookWithPromotion(book, now);

      return { book: formattedBook };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createBook(bookData: BookDto) {
    try {
      const isExistedBook = await this.prismaService.books.findFirst({
        where: {
          title: bookData.title,
        },
      });

      if (isExistedBook && !isExistedBook.isDeleted) {
        throw new HttpException(
          BookError.BOOK_IS_EXISTED,
          HttpStatus.BAD_REQUEST,
        );
      }

      const listCategoryId = bookData.categories.map((item: string) => ({
        categoryId: item,
      }));

      const uniqueSlug = generateUniqueSlug(bookData.title);

      const newBook = await this.prismaService.books.create({
        data: {
          title: bookData.title,
          rating: 5,
          slug: uniqueSlug,
          description: bookData.description,
          price: bookData.price,
          discount: bookData.discount >= 0 ? bookData.discount : 0,
          amount: bookData.amount >= 1 ? bookData.amount : 1,
          thumbnail: process.env.DEFAULT_BOOK_IMAGE,
          categories: {
            create: listCategoryId.map((item) => ({
              categories: {
                connect: {
                  id: item.categoryId,
                },
              },
            })),
          },
          author: {
            connect: {
              id: bookData.authorId,
            },
          },
          publisher: {
            connect: {
              id: bookData.publisherId,
            },
          },
        },
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

      return { book: newBook };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async updateBook(
    id: string,
    thumbnail: Express.Multer.File,
    bookData: BookDto,
  ) {
    try {
      const isExistedBook = await this.prismaService.books.findFirst({
        where: {
          id: id,
        },
      });

      if (!isExistedBook) {
        throw new HttpException(
          BookError.BOOK_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      let url = process.env.DEFAULT_CATEGORY_IMAGE;

      if (thumbnail) {
        if (thumbnail.size > parseInt(process.env.MAX_FILE_SIZE)) {
          throw new HttpException(
            BookError.FILE_TOO_LARGE,
            HttpStatus.BAD_REQUEST,
          );
        }

        const thumbnail_upload =
          await this.cloudinaryService.uploadFile(thumbnail);
        url = thumbnail_upload.secure_url;
      } else if (isExistedBook && isExistedBook.thumbnail) {
        url = isExistedBook.thumbnail;
      }

      const updatedBook = await this.prismaService.books.update({
        where: {
          id: id,
        },
        data: {
          title: bookData.title,
          description: bookData.description,
          price: bookData.price,
          discount: bookData.discount >= 0 ? bookData.discount : 0,
          amount: bookData.amount >= 1 ? bookData.amount : 1,
          thumbnail: url,
          authorId: bookData.authorId,
          publisherId: bookData.publisherId,
        },
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

      return { book: updatedBook };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteBook(id: string) {
    try {
      const isExistedBook = await this.prismaService.books.findFirst({
        where: {
          id: id,
        },
      });

      if (!isExistedBook) {
        throw new HttpException(
          BookError.BOOK_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (isExistedBook && isExistedBook.isDeleted) {
        throw new HttpException(
          BookError.BOOK_IS_DELETED,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.books.update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },
      });

      return null;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async uploadThumbnail(thumbnail: Express.Multer.File, id: string) {
    try {
      const book = await this.prismaService.books.findUnique({
        where: { id },
        select: {
          thumbnail: true,
        },
      });

      if (thumbnail.size > parseInt(process.env.MAX_FILE_SIZE)) {
        throw new HttpException(
          BookError.FILE_TOO_LARGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (book.thumbnail !== process.env.DEFAULT_BOOK_IMAGE) {
        await this.cloudinaryService.deleteFile(book.thumbnail);
      }

      if (thumbnail === undefined) {
        return await this.prismaService.books.update({
          where: { id },
          data: {
            thumbnail: process.env.DEFAULT_BOOK_IMAGE,
          },
          select: {
            id: true,
            title: true,
            description: true,
            categories: true,
            price: true,
            amount: true,
            thumbnail: true,
            author: true,
          },
        });
      }

      const { secure_url } = await this.cloudinaryService.uploadFile(thumbnail);
      return await this.prismaService.books.update({
        where: { id },
        data: {
          thumbnail: secure_url,
        },
        select: {
          id: true,
          title: true,
          description: true,
          categories: true,
          price: true,
          amount: true,
          thumbnail: true,
          author: true,
        },
      });
    } catch (error) {
      return exceptionHandler(error);
    }
  }

  async uploadSubImage(subimg: Express.Multer.File, id: string) {
    try {
      const book = await this.prismaService.books.findUnique({
        where: { id },
      });

      if (!book) {
        throw new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      if (subimg.size > parseInt(process.env.MAX_FILE_SIZE)) {
        throw new HttpException(
          BookError.FILE_TOO_LARGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { secure_url } = await this.cloudinaryService.uploadFile(subimg);

      const newSubimg = await this.prismaService.bookImages.create({
        data: {
          url: secure_url,
          bookId: id,
        },
      });

      return {
        id: newSubimg.id,
        url: newSubimg.url,
      };
    } catch (error) {
      return exceptionHandler(error);
    }
  }

  async getBookSubImgs(bookId: string) {
    try {
      const subImgList = await this.prismaService.bookImages.findMany({
        where: {
          bookId,
        },
      });

      return subImgList;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getTop10BestSeller() {
    try {
      const bookList = await this.prismaService.books.findMany({
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
            select: {
              type: true,
              discountFlashSale: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      const now = new Date();

      const formattedBooks = bookList.map((book) =>
        this.formatBookWithPromotion(book, now),
      );

      return formattedBooks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getTop10Newest() {
    try {
      const bookList = await this.prismaService.books.findMany({
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
