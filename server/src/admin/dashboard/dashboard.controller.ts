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
    const bestSellers = await this.dashboardService.getBestSellerProduct();
    const newFeedbacks = await this.dashboardService.getNewFeedback();

    console.log(newFeedbacks);
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
