import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prismaService: PrismaService) {}

  async getAllFeedbacks(pageIndex: number = 1) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const [feedbacks, totalRecord] = await Promise.all([
        this.prismaService.feedbacks.findMany({
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            book: {
              select: {
                title: true,
                thumbnail: true,
              },
            },
            user: {
              select: {
                displayName: true,
              },
            },
          },
        }),
        this.prismaService.feedbacks.count(),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        feedbacks,
        totalPage,
        totalRecord,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
