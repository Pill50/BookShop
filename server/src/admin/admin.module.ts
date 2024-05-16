import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [CategoryModule, AuthModule],
})
export class AdminModule {}
