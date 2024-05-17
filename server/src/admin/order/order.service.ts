import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthError, exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getAllOrders() {
    try {
      const orders = await this.prismaService.orders.findMany();
      return orders;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

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
          recieverName: orderData.recieverName,
          recieverPhone: orderData.recieverPhone,
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
