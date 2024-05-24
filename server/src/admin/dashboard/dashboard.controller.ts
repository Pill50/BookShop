import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';

@Controller('admin/dashboard')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @Render('dashboard/index')
  async renderDashboard() {
    const cardStatistic = await this.dashboardService.getStatisticCard();
    const recentlyOrders = await this.dashboardService.getRecentlyOrder();
    const statistics = await this.dashboardService.getStatistics();
    const bestSellers = await this.dashboardService.getBestSellerProduct();
    const newFeedbacks = await this.dashboardService.getNewFeedback();

    return {
      cardStatistic,
      recentlyOrders,
      statistics,
      bestSellers,
      newFeedbacks,
    };
  }

  @Get('/getRevenueChartData')
  async getRevenueChartData() {
    const revenueChartData = await this.dashboardService.getRevenueChartData();

    return { revenueChartData };
  }

  @Get('/getFeedbackPieData')
  async getFeedbackPieData() {
    const feedbackPieData = await this.dashboardService.getFeedbackPieData();

    return { feedbackPieData };
  }
}
