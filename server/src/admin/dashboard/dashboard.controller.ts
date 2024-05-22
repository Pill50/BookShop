import { Controller, Get, Render } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @Render('dashboard/index')
  async renderDashboard() {
    const cardStatistic = await this.dashboardService.getStatisticCard();
    const recentlyOrders = await this.dashboardService.getRecentlyOrder();
    const statistics = await this.dashboardService.getStatistics();
    return { cardStatistic, recentlyOrders, statistics };
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
