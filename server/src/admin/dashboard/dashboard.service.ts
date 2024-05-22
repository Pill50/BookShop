import { Injectable } from '@nestjs/common';
import { Orders } from '@prisma/client';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  async getRevenue(orderList: any) {
    try {
      const revenue = orderList.reduce(
        (acc: number, cur: any) =>
          acc + (cur.status === 'COMPLETED' ? cur.totalPrice : 0),
        0,
      );

      return revenue;
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
