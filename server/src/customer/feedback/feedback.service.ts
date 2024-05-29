import { FeedbackDto } from './dto/feedback.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookError, exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prismaService: PrismaService) {}

  async getBookFbacks(bookId: string) {
    try {
      const book = await this.prismaService.books.findUnique({
        where: {
          id: bookId,
        },
      });

      if (!book)
        return new HttpException(
          BookError.BOOK_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );

      const feedbacks = await this.prismaService.feedbacks.findMany({
        where: {
          bookId: bookId,
        },
      });

      return feedbacks;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createFeedback(feedbackData: FeedbackDto) {
    try {
      const { bookId, userId, content, rating } = feedbackData;
      const existingFeedback = await this.prismaService.feedbacks.findFirst({
        where: {
          bookId: bookId,
          userId: userId,
        },
      });

      if (existingFeedback) {
        throw new HttpException(
          'You have already reviewed this items',
          HttpStatus.BAD_REQUEST,
        );
      }

      const feedback = await this.prismaService.feedbacks.create({
        data: {
          content,
          bookId,
          userId,
          rating,
        },
      });

      const allFeedbacks = await this.prismaService.feedbacks.findMany({
        where: {
          bookId: bookId,
        },
      });

      const averageRating =
        allFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        allFeedbacks.length;

      await this.prismaService.books.update({
        where: {
          id: bookId,
        },
        data: {
          rating: averageRating,
        },
      });

      return feedback;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
