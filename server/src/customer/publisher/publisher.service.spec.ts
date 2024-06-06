import { Test, TestingModule } from '@nestjs/testing';
import { PublisherService } from './publisher.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PublisherService', () => {
  let service: PublisherService;
  let prismaService: PrismaService;
  let publisher = {
    id: '1',
    name: 'publisher',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherService,
        {
          provide: PrismaService,
          useValue: {
            publishers: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPublishers', () => {
    it('should return an array of publishers', async () => {
      jest
        .spyOn(prismaService.publishers, 'findMany')
        .mockResolvedValueOnce([publisher]);

      const result = await service.getAllPublishers();

      expect(result).toEqual([publisher]);
      expect(prismaService.publishers.findMany).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest
        .spyOn(prismaService.publishers, 'findMany')
        .mockRejectedValueOnce(error);

      await expect(service.getAllPublishers()).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });
});
