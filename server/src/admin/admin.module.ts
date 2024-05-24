import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';
import { PromotionModule } from './promotion/promotion.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AboutModule } from './about/about.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthorModule } from './author/author.module';
import { PublisherModule } from './publisher/publisher.module';
@Module({
  controllers: [],
  providers: [],
  imports: [
    CategoryModule,
    AuthModule,
    BookModule,
    OrderModule,
    PromotionModule,
    FeedbackModule,
    AboutModule,
    DashboardModule,
    AuthorModule,
    PublisherModule,
  ],
})
export class AdminModule {}
