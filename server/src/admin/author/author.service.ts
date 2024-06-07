import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prismaService: PrismaService) {}

  async getAllAuthors(pageIndex: number = 1) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const [authors, totalRecord] = await Promise.all([
        this.prismaService.authors.findMany({
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.authors.count(),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        authors,
        totalPage,
        totalRecord,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getAuthorById(id: string) {
    try {
      const author = await this.prismaService.authors.findUnique({
        where: { id: id },
      });
      return author;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createAuthor(name: string) {
    try {
      const isExistedAuthor = await this.prismaService.authors.findFirst({
        where: { name: name },
      });

      if (isExistedAuthor) {
        throw new HttpException(
          'Author is already existed',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.authors.create({
        data: { name: name },
      });
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updateAuthor(id: string, name: string) {
    try {
      const isExistedAuthor = await this.prismaService.authors.findFirst({
        where: { name: name },
      });

      if (isExistedAuthor) {
        throw new HttpException(
          'Author is already existed',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.authors.update({
        where: {
          id,
        },
        data: { name: name },
      });
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deleteAuthor(id: string) {
    try {
      const isExistedAuthor = await this.prismaService.authors.findUnique({
        where: {
          id: id,
        },
      });

      if (!isExistedAuthor) {
        throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
      }

      await this.prismaService.authors.delete({
        where: {
          id: id,
        },
      });

      return null;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
