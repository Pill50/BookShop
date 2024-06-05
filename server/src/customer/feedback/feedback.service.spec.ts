import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { FeedbackService } from './feedback.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BookError } from 'src/common/errors';
import { AppModule } from 'src/app.module';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getBookFeedbacks', () => {
    it('should return book not found', async () => {
      jest.spyOn(prismaService.books, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getBookFeedbacks('-1')).rejects.toThrow(
        new HttpException(BookError.BOOK_NOT_FOUND, HttpStatus.BAD_REQUEST),
      );
    });

    it('should get feedbacks of this book successfully', async () => {
      const expectedFeedbacks = [
        {
          id: '1',
          bookId: '1',
          userId: '1',
          rating: 3,
          content: 'Nice travel guide, but some outdated info.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.feedbacks, 'findMany')
        .mockResolvedValueOnce(expectedFeedbacks);

      const result = await service.getBookFeedbacks('1');

      expect(result).toEqual(expectedFeedbacks);
      expect(prismaService.feedbacks.findMany).toHaveBeenCalledWith({
        where: { bookId: '1' },
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'An error occurred';
      jest
        .spyOn(prismaService.feedbacks, 'findMany')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.getBookFeedbacks('1')).rejects.toThrow(errorMessage); // Expect the original error
    });
  });

  describe('createFeedback', () => {
    it('should return an error if user already reviewed the book', async () => {
      const existingFeedback = {
        id: '1',
        bookId: '1',
        userId: '1',
        rating: 5,
        content: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.feedbacks, 'findFirst')
        .mockResolvedValueOnce(existingFeedback);

      const newFeedback = {
        bookId: '1',
        userId: '1',
        content: 'New feedback',
        rating: 4,
      };

      await expect(service.createFeedback(newFeedback)).rejects.toThrow(
        new HttpException(
          'You have already reviewed this items',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    // it('should create new feedback successfully', async () => {
    //   const createdFeedback = {
    //     id: '1',
    //     bookId: '1',
    //     userId: '1',
    //     rating: 5,
    //     content: 'test',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   };
    //   const expectedAllFeedbacks = [{ id: 2, rating: 3 }];

    //   jest
    //     .spyOn(prismaService.feedbacks, 'findFirst')
    //     .mockResolvedValueOnce(null);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'create')
    //     .mockResolvedValueOnce(createdFeedback);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findMany')
    //     .mockResolvedValueOnce(createdFeedback);
    //   jest.spyOn(prismaService.books, 'update').mockResolvedValueOnce({});

    //   const result = await service.createFeedback({
    //     bookId: '1',
    //     userId: '2',
    //     content: 'Test feedback',
    //     rating: 5,
    //   });

    //   expect(result).toEqual(createdFeedback);
    //   expect(prismaService.feedbacks.create).toHaveBeenCalledWith({
    //     data: { bookId: '1', userId: '2', content: 'Test feedback', rating: 5 }, // Verify data passed
    //   });
    //   // Verify other function calls as needed (average rating calculation, book update)
    // });

    // it('should handle errors during feedback creation', async () => {
    //   const feedbackData = {
    //     bookId: '1',
    //     userId: '2',
    //     content: 'Test feedback',
    //     rating: 5,
    //   };
    //   const errorMessage = 'Prisma error creating feedback';
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findFirst')
    //     .mockResolvedValueOnce(null);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'create')
    //     .mockRejectedValueOnce(new Error(errorMessage));

    //   try {
    //     await service.createFeedback(feedbackData);
    //     fail('Expected an error to be thrown');
    //   } catch (error) {
    //     // Expect the appropriate error handling based on exceptionHandler
    //     expect(error instanceof Error).toBeTruthy(); // Adjust based on actual error type
    //   }
    // });

    // it('should handle errors during average rating calculation', async () => {
    //   const feedbackData = {
    //     bookId: '1',
    //     userId: '2',
    //     content: 'Test feedback',
    //     rating: 5,
    //   };
    //   const existingFeedback = [{ id: 2, rating: 3 }];
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findFirst')
    //     .mockResolvedValueOnce(null);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'create')
    //     .mockResolvedValueOnce({ id: 1 });
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findMany')
    //     .mockRejectedValueOnce(new Error('Prisma error finding feedbacks'));
    //   jest
    //     .spyOn(prismaService.books, 'update')
    //     .mockRejectedValueOnce(new Error('Prisma error updating book')); // Mock book update error

    //   try {
    //     await service.createFeedback(feedbackData);
    //     fail('Expected an error to be thrown');
    //   } catch (error) {
    //     // Expect the appropriate error handling based on exceptionHandler
    //     expect(error instanceof Error).toBeTruthy(); // Adjust based on actual error type
    //   }
    // });

    // it('should handle errors during book update', async () => {
    //   const feedbackData = {
    //     bookId: '1',
    //     userId: '2',
    //     content: 'Test feedback',
    //     rating: 5,
    //   };
    //   const existingFeedback = [{ id: 2, rating: 3 }];
    //   const createdFeedback = { id: 1, ...feedbackData };
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findFirst')
    //     .mockResolvedValueOnce(null);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'create')
    //     .mockResolvedValueOnce(createdFeedback);
    //   jest
    //     .spyOn(prismaService.feedbacks, 'findMany')
    //     .mockResolvedValueOnce(existingFeedback.concat(createdFeedback));
    //   jest
    //     .spyOn(prismaService.books, 'update')
    //     .mockRejectedValueOnce(new Error('Prisma error updating book'));

    //   try {
    //     await service.createFeedback(feedbackData);
    //     fail('Expected an error to be thrown');
    //   } catch (error) {
    //     expect(error instanceof Error).toBeTruthy();
    //   }
    // });
  });
});
