import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OrderService', () => {
  let service: OrderService;
  let prismaServiceMock: {
    orders: {
      findMany: jest.Mock<any, any>;
      findUnique: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
      count: jest.Mock<any, any>;
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      orders: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders with pagination', async () => {
      const pageIndex = 1;
      const take = 10;
      const skip = 0;
      const ordersMock = [{ id: '1', status: OrderStatus.PENDING }];
      const totalRecordMock = 1;
      const totalPageMock = Math.ceil(totalRecordMock / take);

      prismaServiceMock.orders.findMany.mockResolvedValueOnce(ordersMock);
      prismaServiceMock.orders.count.mockResolvedValueOnce(totalRecordMock);

      const result = await service.getAllOrders(pageIndex);

      expect(result).toEqual({
        orders: ordersMock,
        totalPage: totalPageMock,
        totalRecord: totalRecordMock,
      });
      expect(prismaServiceMock.orders.findMany).toHaveBeenCalledWith({
        skip,
        take,
        include: {
          shipper: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(prismaServiceMock.orders.count).toHaveBeenCalled();
    });

    it('should handle errors when querying orders', async () => {
      const pageIndex = 1;
      const errorMock = new Error('Failed to fetch orders');

      prismaServiceMock.orders.findMany.mockRejectedValueOnce(errorMock);

      await expect(service.getAllOrders(pageIndex)).rejects.toThrow(errorMock);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID with its details', async () => {
      const id = '1';
      const orderMock = { id: '1', status: OrderStatus.PENDING };

      prismaServiceMock.orders.findUnique.mockResolvedValueOnce(orderMock);

      const result = await service.getOrderById(id);

      expect(result).toEqual(orderMock);
      expect(prismaServiceMock.orders.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          shipper: true,
          orderDetail: {
            include: {
              book: {
                select: {
                  title: true,
                  thumbnail: true,
                },
              },
            },
          },
          payments: {
            select: {
              method: true,
            },
          },
        },
      });
    });

    it('should handle errors when querying an order by ID', async () => {
      const id = '1';
      const errorMock = new Error('Failed to fetch order');

      prismaServiceMock.orders.findUnique.mockRejectedValueOnce(errorMock);

      await expect(service.getOrderById(id)).rejects.toThrow(errorMock);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      const id = '1';
      const status = OrderStatus.COMPLETED;
      const orderMock = { id: '1', status: OrderStatus.PENDING };

      prismaServiceMock.orders.update.mockResolvedValueOnce(orderMock);

      const result = await service.updateStatus(id, status);

      expect(result).toEqual(orderMock);
      expect(prismaServiceMock.orders.update).toHaveBeenCalledWith({
        where: { id },
        data: { status },
      });
    });

    it('should handle errors when updating the status of an order', async () => {
      const id = '1';
      const status = OrderStatus.COMPLETED;
      const errorMock = new Error('Failed to update order status');

      prismaServiceMock.orders.update.mockRejectedValueOnce(errorMock);

      await expect(service.updateStatus(id, status)).rejects.toThrow(errorMock);
    });
  });
});
