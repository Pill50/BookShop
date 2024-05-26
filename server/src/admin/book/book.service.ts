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
          rating: undefined,
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

      const formattedBook = {
        ...newBook,
        categories: newBook.categories.map(
          (category) => category.categories.title,
        ),
      };

      return { book: formattedBook };
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

      let url;
      if (thumbnail) {
        if (thumbnail.size > parseInt(process.env.MAX_FILE_SIZE)) {
          throw new HttpException(
            BookError.FILE_TOO_LARGE,
            HttpStatus.BAD_REQUEST,
          );
        } else if (thumbnail.size > 0) {
          const thumbnail_upload =
            await this.cloudinaryService.uploadFile(thumbnail);
          url = thumbnail_upload.secure_url;
        } else {
          url = process.env.DEFAULT_CATEGORY_IMAGE;
        }
      } else if (isExistedBook && isExistedBook.thumbnail) {
        url = isExistedBook.thumbnail;
      } else {
        url = process.env.DEFAULT_CATEGORY_IMAGE;
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

      const formattedBook = {
        ...updatedBook,
        categories: updatedBook.categories.map(
          (category) => category.categories.title,
        ),
      };

      return { book: formattedBook };
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
