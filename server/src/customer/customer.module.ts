import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, UserModule, CategoryModule],
})
export class CustomerModule {}
