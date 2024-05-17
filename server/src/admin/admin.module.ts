import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [CategoryModule, AuthModule, BookModule, OrderModule],
})
export class AdminModule {}
