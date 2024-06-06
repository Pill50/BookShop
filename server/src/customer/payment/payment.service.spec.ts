import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as errors from 'src/common/errors';
import { UpdatePaymentDto } from './dto/updatePayment.dto';
import { PaymentType } from '@prisma/client';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: PrismaService;
  let payment = {
    id: '1',
    status: false,
    transactionId: null,
    method: PaymentType.COD,
    orderId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: {
            payments: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status successfully', async () => {
      const paymentData: UpdatePaymentDto = {
        paymentId: '1',
        transactionId: 'transaction_1',
      };

      jest
        .spyOn(prismaService.payments, 'findUnique')
        .mockResolvedValueOnce(payment);
      jest.spyOn(prismaService.payments, 'update').mockResolvedValueOnce({
        ...payment,
        status: true,
        transactionId: paymentData.transactionId,
      });

      const result = await service.updatePaymentStatus(paymentData);

      expect(result.status).toBe(true);
      expect(result.transactionId).toBe(paymentData.transactionId);
      expect(prismaService.payments.findUnique).toHaveBeenCalledWith({
        where: { id: paymentData.paymentId },
      });
      expect(prismaService.payments.update).toHaveBeenCalledWith({
        where: { id: paymentData.paymentId },
        data: {
          status: true,
          transactionId: paymentData.transactionId,
        },
      });
    });

    it('should throw error if payment is not found', async () => {
      const paymentData: UpdatePaymentDto = {
        paymentId: 'payment_1',
        transactionId: 'transaction_1',
      };

      jest
        .spyOn(prismaService.payments, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.updatePaymentStatus(paymentData)).rejects.toThrow(
        new HttpException('Payment not found', HttpStatus.BAD_REQUEST),
      );
      expect(prismaService.payments.findUnique).toHaveBeenCalledWith({
        where: { id: paymentData.paymentId },
      });
      expect(prismaService.payments.update).not.toHaveBeenCalled();
    });

    it('should handle exceptions properly', async () => {
      const paymentData: UpdatePaymentDto = {
        paymentId: 'payment_1',
        transactionId: 'transaction_1',
      };
      const error = new Error('Internal Server');

      jest
        .spyOn(prismaService.payments, 'findUnique')
        .mockRejectedValueOnce(error);
      await expect(
        service.updatePaymentStatus(paymentData),
      ).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });
});
