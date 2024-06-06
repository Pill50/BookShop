import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prismaServiceMock: {
    feedbacks: {
      findMany: jest.Mock<any, any>;
      count: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      feedbacks: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFeedbacks', () => {
    it('should return all feedbacks with pagination', async () => {
      const pageIndex = 1;
      const take = 10;
      const skip = 0;
      const feedbacksMock = [{ id: '1', message: 'Great book!' }];
      const totalRecordMock = 1;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.feedbacks.findMany.mockResolvedValueOnce(feedbacksMock);
      prismaServiceMock.feedbacks.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllFeedbacks(pageIndex);

      expect(result).toEqual({
        feedbacks: feedbacksMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.feedbacks.findMany).toHaveBeenCalledWith({
        skip,
        take,
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
      expect(prismaServiceMock.feedbacks.count).toHaveBeenCalled();
    });

    it('should handle errors when querying feedbacks', async () => {
      const pageIndex = 1;
      const errorMock = new Error('Failed to fetch feedbacks');

      prismaServiceMock.feedbacks.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getAllFeedbacks(pageIndex)).rejects.toThrow(
        errorMock,
      );
    });
  });
});
