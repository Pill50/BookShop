import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePaymentDto } from './dto/updatePayment.dto';
@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async updatePaymentStatus(paymentData: UpdatePaymentDto) {
    try {
      const isPaymentFound = await this.prismaService.payments.findUnique({
        where: { id: paymentData.paymentId },
      });

      if (!isPaymentFound) {
        throw new HttpException('Payment not found', HttpStatus.BAD_REQUEST);
      }

      const updateOrderPayment = await this.prismaService.payments.update({
        where: { id: paymentData.paymentId },
        data: {
          status: true,
          transactionId: paymentData.transactionId,
        },
      });

      return updateOrderPayment;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
