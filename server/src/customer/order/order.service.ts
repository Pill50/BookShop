import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async createOrder(userId: string, orderData: OrderDto) {
    try {
      const orderDetails = orderData.orderItem.map((item) => ({
        amount: item.amount,
        discount: item.discount,
        price: item.price,
        totalPrice: item.price * item.amount,
        bookId: item.bookId,
        orderDate: item.orderDate,
      }));

      const order = await this.prismaService.orders.create({
        data: {
          userId: userId,
          amount: orderData.amount,
          totalPrice: orderData.totalPrice,
          note: orderData.note,
          status: 'PENDING',
          address: orderData.address,
          receiverName: orderData.recieverName,
          receiverPhone: orderData.recieverPhone,
          shipperId: orderData.shipperId,
          orderDetail: {
            createMany: {
              data: orderDetails,
            },
          },
        },
        include: {
          orderDetail: true,
        },
      });

      await Promise.all(
        orderData.orderItem.map(async (item) => {
          await this.prismaService.books.update({
            where: { id: item.bookId },
            data: {
              amount: {
                decrement: item.amount,
              },
            },
          });
        }),
      );

      return order;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
