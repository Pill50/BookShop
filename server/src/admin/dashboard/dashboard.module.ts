import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BookService } from '../book/book.service';
import { CategoryService } from '../category/category.service';
import { OrderService } from '../order/order.service';
import { FeedbackService } from '../feedback/feedback.service';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    BookService,
    CategoryService,
    OrderService,
    FeedbackService,
  ],
})
export class DashboardModule {}
