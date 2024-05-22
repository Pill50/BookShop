import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exceptionHandler } from 'src/common/errors';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  private getStartAndEndOfToday() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return { startOfToday, endOfToday };
  }

  private getStartOfMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return startOfMonth;
  }

  private calculateTotalRevenue(orders: any) {
    return orders.reduce((acc: any, cur: any) => acc + cur.totalPrice, 0);
  }

  private getStartAndEndOfMonth(date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return { startOfMonth, endOfMonth };
  }

  async getStatisticCard() {
    try {
      const totalBook = await this.prismaService.books.count();
      const totalPublisher = await this.prismaService.publishers.count();
      const totalAuthor = await this.prismaService.authors.count();
      const totalOrder = await this.prismaService.orders.count();

      const { startOfToday, endOfToday } = this.getStartAndEndOfToday();
      const startOfMonth = this.getStartOfMonth();
      const now = new Date();

      const orderToday = await this.prismaService.orders.count({
        where: {
          updatedAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });

      const orderThisMonth = await this.prismaService.orders.count({
        where: {
          updatedAt: {
            gte: startOfMonth,
            lte: now,
          },
        },
      });

      const totalOrderComplete = await this.prismaService.orders.findMany({
        where: {
          status: 'COMPLETED',
        },
      });
      const totalRevenue = this.calculateTotalRevenue(totalOrderComplete);

      const totalOrderCompleteToday = await this.prismaService.orders.findMany({
        where: {
          status: 'COMPLETED',
          updatedAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });
      const todayRevenue = this.calculateTotalRevenue(totalOrderCompleteToday);

      const totalOrderCompleteThisMonth =
        await this.prismaService.orders.findMany({
          where: {
            status: 'COMPLETED',
            updatedAt: {
              gte: startOfMonth,
              lte: now,
            },
          },
        });
      const thisMonthRevenue = this.calculateTotalRevenue(
        totalOrderCompleteThisMonth,
      );

      return {
        totalBook,
        totalPublisher,
        totalAuthor,
        totalOrder,
        orderToday,
        orderThisMonth,
        totalRevenue,
        todayRevenue,
        thisMonthRevenue,
      };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async getRevenueChartData() {
    try {
      const revenues = [];
      const currentDate = new Date();

      for (let i = 0; i < 10; i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1,
        );
        const { startOfMonth, endOfMonth } = this.getStartAndEndOfMonth(date);

        const completedOrders = await this.prismaService.orders.findMany({
          where: {
            status: 'COMPLETED',
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const monthlyRevenue = this.calculateTotalRevenue(completedOrders);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        revenues.push({ time: `${month}/${year}`, revenue: monthlyRevenue });
      }

      return revenues.reverse();
    } catch (err) {
      throw exceptionHandler(err);
    }
  }

  async getFeedbackPieData() {
    try {
      const positiveFeedback = await this.prismaService.feedbacks.count({
        where: {
          rating: {
            gte: 4,
          },
        },
      });

      const goodFeedback = await this.prismaService.feedbacks.count({
        where: {
          rating: {
            gte: 3,
            lt: 4,
          },
        },
      });

      const negativeFeedback = await this.prismaService.feedbacks.count({
        where: {
          rating: {
            gte: 1,
            lt: 3,
          },
        },
      });

      return {
        positiveFeedback,
        goodFeedback,
        negativeFeedback,
      };
    } catch (err) {
      throw exceptionHandler(err);
    }
  }
}
