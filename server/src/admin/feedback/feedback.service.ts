import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prismaService: PrismaService) {}

  async getAllFeedbacks() {
    try {
      const feedbacks = await this.prismaService.feedbacks.findMany({
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
      });
      return feedbacks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
