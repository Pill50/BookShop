import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getAllOrders() {
    try {
      const orders = await this.prismaService.orders.findMany({
        include: {
          shipper: true,
        },
      });
      return orders;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async getOrderById(id: string) {
    try {
      const order = await this.prismaService.orders.findUnique({
        where: {
          id,
        },
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
        },
      });
      return order;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      const order = await this.prismaService.orders.update({
        where: {
          id,
        },
        data: {
          status: status,
        },
      });
      return order;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
