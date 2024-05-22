import { Controller, Get, Render } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CategoryService } from '../category/category.service';
import { FeedbackService } from '../feedback/feedback.service';
import { OrderService } from '../order/order.service';
import { BookService } from '../book/book.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @Render('dashboard/index')
  async rendergGetAllCategories() {
    const cardStatistic = await this.dashboardService.getStatisticCard();

    console.log(cardStatistic);
    return { cardStatistic };
  }
}
