import { Controller, Get, Render } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CategoryService } from '../category/category.service';
import { FeedbackService } from '../feedback/feedback.service';
import { OrderService } from '../order/order.service';
import { BookService } from '../book/book.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly categoryService: CategoryService,
    private readonly bookService: BookService,
    private readonly feedbackService: FeedbackService,
    private readonly orderService: OrderService,
  ) {}

  @Get('/')
  @Render('dashboard/index')
  async rendergGetAllCategories() {
    const books = await this.bookService.getAllBooks();
    const orders = await this.orderService.getAllOrders();
    const categories = await this.categoryService.getAllCategories();
    const feedbacks = await this.feedbackService.getAllFeedbacks();
    const revenue = await this.dashboardService.getRevenue(orders.orders);
  }
}
