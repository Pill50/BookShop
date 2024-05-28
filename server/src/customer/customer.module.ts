import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { BookModule } from './book/book.module';
import { PublisherModule } from './publisher/publisher.module';
import { ShipperModule } from './shipper/shipper.module';
import { OrderModule } from './order/order.module';
import { PromotionModule } from './promotion/promotion.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    BookModule,
    PublisherModule,
    ShipperModule,
    OrderModule,
    PromotionModule,
    FeedbackModule,
  ],
})
export class CustomerModule {}
