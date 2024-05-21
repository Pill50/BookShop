import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getAllOrders(pageIndex: number = 1) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const [orders, totalRecord] = await Promise.all([
        this.prismaService.orders.findMany({
          skip,
          take,
          include: {
            shipper: true,
          },
        }),
        this.prismaService.orders.count(),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        orders,
        totalPage,
        totalRecord,
      };
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
