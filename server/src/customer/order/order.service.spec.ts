import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus, PaymentType } from '@prisma/client';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;
  const orderDto: OrderDto = {
    amount: 2,
    totalPrice: 1000,
    status: 'PENDING',
    note: 'Test Note',
    address: 'Test Address',
    recieverName: 'John Doe',
    recieverPhone: '123456789',
    shipperId: 'shipper_1',
    paymentMethod: PaymentType.COD,
    orderItem: [
      {
        id: 'book_1',
        orderId: 'book_1',
        amount: 2,
        price: 500,
        discount: 0,
        totalPrice: 500,
        orderDate: new Date(),
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: {
            orders: {
              create: jest.fn(),
              update: jest.fn(),
            },
            books: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order successfully with COD payment', async () => {
      const createdOrder = {
        id: 'order_1',
        ...orderDto,
        status: OrderStatus.PENDING,
        orderDetail: [],
        payments: [],
        userId: 'user_1',
        receiverName: 'reciever_1',
        receiverPhone: '012345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.orders, 'create')
        .mockResolvedValueOnce(createdOrder);
      jest.spyOn(prismaService.books, 'update').mockResolvedValueOnce(null);

      const result = await service.createOrder('user_1', orderDto);

      expect(result).toEqual(createdOrder);
      expect(prismaService.orders.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_1',
          amount: 2,
          totalPrice: 1000,
          note: 'Test Note',
          status: 'PENDING',
          address: 'Test Address',
          receiverName: 'John Doe',
          receiverPhone: '123456789',
          shipperId: 'shipper_1',
          payments: {
            create: {
              method: PaymentType.COD,
              status: true,
            },
          },
          orderDetail: {
            createMany: {
              data: expect.any(Array),
            },
          },
        }),
        include: {
          orderDetail: true,
          payments: true,
        },
      });

      expect(prismaService.books.update).toHaveBeenCalledWith({
        where: { id: 'book_1' },
        data: {
          amount: {
            decrement: 2,
          },
        },
      });
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest.spyOn(prismaService.orders, 'create').mockRejectedValueOnce(error);

      await expect(
        service.createOrder('user_1', orderDto),
      ).rejects.toMatchObject({
        response: 'Internal Server',
        status: 500,
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = 'order_1';
      const status = OrderStatus.SHIPPED;

      const updatedOrder = {
        id: 'order_1',
        ...orderDto,
        status: OrderStatus.PENDING,
        orderDetail: [],
        payments: [],
        userId: 'user_1',
        receiverName: 'reciever_1',
        receiverPhone: '012345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.orders, 'update')
        .mockResolvedValueOnce(updatedOrder);

      const result = await service.updateOrderStatus(orderId, status);

      expect(result).toEqual(updatedOrder);
      expect(prismaService.orders.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status },
        include: { orderDetail: true },
      });
    });

    it('should handle errors correctly', async () => {
      const orderId = 'order_1';
      const status = OrderStatus.SHIPPED;

      const error = new Error('Internal Server');
      jest.spyOn(prismaService.orders, 'update').mockRejectedValueOnce(error);

      await expect(
        service.updateOrderStatus(orderId, status),
      ).rejects.toMatchObject({
        response: 'Internal Server',
        status: 500,
      });
    });
  });
});
