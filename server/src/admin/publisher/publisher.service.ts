import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublisherService {
  constructor(private prismaService: PrismaService) {}

  async getAllPublishers(pageIndex: number = 1) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const [publishers, totalRecord] = await Promise.all([
        this.prismaService.publishers.findMany({
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.publishers.count(),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        publishers,
        totalPage,
        totalRecord,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getPublisherById(id: string) {
    try {
      const publisher = await this.prismaService.publishers.findUnique({
        where: { id: id },
      });
      return publisher;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createPublisher(name: string) {
    try {
      const isExistedPublisher = await this.prismaService.publishers.findFirst({
        where: { name: name },
      });

      if (isExistedPublisher) {
        throw new HttpException(
          'Publisher is already existed',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.publishers.create({
        data: { name: name },
      });
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updatePublisher(id: string, name: string) {
    try {
      const isExistedPublisher = await this.prismaService.publishers.findFirst({
        where: { name: name },
      });

      if (isExistedPublisher) {
        throw new HttpException(
          'Author is already existed',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.publishers.update({
        where: {
          id,
        },
        data: { name: name },
      });
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deletePublisher(id: string) {
    try {
      const isExistedPublisher = await this.prismaService.publishers.findUnique(
        {
          where: {
            id: id,
          },
        },
      );

      if (!isExistedPublisher) {
        throw new HttpException('Publisher not found', HttpStatus.BAD_REQUEST);
      }

      await this.prismaService.publishers.delete({
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
