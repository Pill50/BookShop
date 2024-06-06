import { Test, TestingModule } from '@nestjs/testing';
import { PublisherService } from './publisher.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PublisherService', () => {
  let service: PublisherService;
  let prismaServiceMock: {
    publishers: {
      findMany: jest.Mock<any, any>;
      count: jest.Mock<any, any>;
      findUnique: jest.Mock<any, any>;
      findFirst: jest.Mock<any, any>;
      create: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
      delete: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      publishers: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPublishers', () => {
    it('should return publishers with total page and total record', async () => {
      const publishersMock = [{ id: '1', name: 'Publisher 1' }];
      const totalRecordMock = 1;
      const take = 10;
      const skip = 0;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.publishers.findMany.mockResolvedValueOnce(
        publishersMock,
      );
      prismaServiceMock.publishers.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllPublishers();

      expect(result).toEqual({
        publishers: publishersMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.publishers.findMany).toHaveBeenCalledWith({
        skip,
        take,
      });
      expect(prismaServiceMock.publishers.count).toHaveBeenCalled();
    });

    it('should handle errors when querying publishers', async () => {
      const errorMock = new Error('Failed to fetch publishers');

      prismaServiceMock.publishers.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getAllPublishers()).rejects.toThrow(errorMock);
    });
  });

  describe('getPublisherById', () => {
    it('should return a publisher by ID', async () => {
      const publisherMock = { id: '1', name: 'Publisher 1' };
      const id = '1';

      prismaServiceMock.publishers.findUnique.mockResolvedValueOnce(
        publisherMock,
      );

      const result = await service.getPublisherById(id);

      expect(result).toEqual(publisherMock);
      expect(prismaServiceMock.publishers.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should handle errors when querying a publisher by ID', async () => {
      const id = '1';
      const errorMock = new Error('Failed to fetch publisher');

      prismaServiceMock.publishers.findUnique.mockRejectedValueOnce(errorMock);

      await expect(service.getPublisherById(id)).rejects.toThrow(errorMock);
    });
  });

  describe('createPublisher', () => {
    it('should create a new publisher', async () => {
      const name = 'New Publisher';

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(null);

      await service.createPublisher(name);

      expect(prismaServiceMock.publishers.create).toHaveBeenCalledWith({
        data: { name },
      });
    });

    it('should throw an error if the publisher already exists', async () => {
      const name = 'Existing Publisher';
      const existingPublisherMock = { id: '1', name: 'Existing Publisher' };

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(
        existingPublisherMock,
      );

      await expect(service.createPublisher(name)).rejects.toThrow(
        new HttpException(
          'Publisher is already existed',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should handle errors when creating a publisher', async () => {
      const name = 'New Publisher';
      const errorMock = new Error('Failed to create publisher');

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(null);
      prismaServiceMock.publishers.create.mockRejectedValueOnce(errorMock);

      await expect(service.createPublisher(name)).rejects.toThrow(errorMock);
    });
  });

  describe('updatePublisher', () => {
    it('should update an existing publisher', async () => {
      const id = '1';
      const name = 'Updated Publisher';

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(null);

      await service.updatePublisher(id, name);

      expect(prismaServiceMock.publishers.update).toHaveBeenCalledWith({
        where: { id },
        data: { name },
      });
    });

    it('should throw an error if the updated name conflicts with an existing publisher', async () => {
      const id = '1';
      const name = 'Existing Publisher';
      const existingPublisherMock = { id: '2', name: 'Existing Publisher' };

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(
        existingPublisherMock,
      );

      await expect(service.updatePublisher(id, name)).rejects.toThrow(
        new HttpException('Author is already existed', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle errors when updating a publisher', async () => {
      const id = '1';
      const name = 'Updated Publisher';
      const errorMock = new Error('Failed to update publisher');

      prismaServiceMock.publishers.findFirst.mockResolvedValueOnce(null);
      prismaServiceMock.publishers.update.mockRejectedValueOnce(errorMock);

      await expect(service.updatePublisher(id, name)).rejects.toThrow(
        errorMock,
      );
    });
  });

  describe('deletePublisher', () => {
    it('should delete an existing publisher', async () => {
      const id = '1';
      const existingPublisherMock = { id: '1', name: 'Existing Publisher' };

      prismaServiceMock.publishers.findUnique.mockResolvedValueOnce(
        existingPublisherMock,
      );

      await service.deletePublisher(id);

      expect(prismaServiceMock.publishers.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an error if the publisher does not exist', async () => {
      const id = '1';

      prismaServiceMock.publishers.findUnique.mockResolvedValueOnce(null);

      await expect(service.deletePublisher(id)).rejects.toThrow(
        new HttpException('Publisher not found', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle errors when deleting a publisher', async () => {
      const id = '1';
      const existingPublisherMock = { id: '1', name: 'Existing Publisher' };
      const errorMock = new Error('Failed to delete publisher');

      prismaServiceMock.publishers.findUnique.mockResolvedValueOnce(
        existingPublisherMock,
      );
      prismaServiceMock.publishers.delete.mockRejectedValueOnce(errorMock);

      await expect(service.deletePublisher(id)).rejects.toThrow(errorMock);
    });
  });
});
