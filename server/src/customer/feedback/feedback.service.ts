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
      const { bookId, userId, content } = feedbackData;

      const feedback = await this.prismaService.feedbacks.create({
        data: {
          content,
          bookId,
          userId,
        },
      });

      return feedback;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
