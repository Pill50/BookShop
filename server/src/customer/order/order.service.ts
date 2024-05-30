import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus, PaymentType } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async createOrder(userId: string, orderData: OrderDto) {
    try {
      const orderDetails = orderData.orderItem.map((item) => ({
        amount: item.amount,
        discount: item.discount,
        price: item.price,
        totalPrice: Number(
          ((item.price * item.amount * (100 - item.discount)) / 100).toFixed(0),
        ),
        bookId: item.id,
        orderDate: item.orderDate,
      }));

      const paymentMethod = orderData.paymentMethod;
      let paymentStatus: boolean;

      if (paymentMethod === PaymentType.COD) {
        paymentStatus = true;
      } else if (paymentMethod === PaymentType.MOMO) {
        paymentStatus = false;
      } else {
        throw new HttpException(
          'Invalid payment method',
          HttpStatus.BAD_REQUEST,
        );
      }

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
          payments: {
            create: {
              method: paymentMethod,
              status: paymentStatus,
            },
          },
        },
        include: {
          orderDetail: true,
          payments: true,
        },
      });

      await Promise.all(
        orderData.orderItem.map(async (item) => {
          await this.prismaService.books.update({
            where: { id: item.id },
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

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const order = await this.prismaService.orders.update({
        where: { id: orderId },
        data: {
          status,
        },
        include: {
          orderDetail: true,
        },
      });

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
      }

      return order;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
