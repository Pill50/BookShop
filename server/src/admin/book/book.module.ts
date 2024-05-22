import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CategoryService } from '../category/category.service';

@Module({
  controllers: [BookController],
  providers: [BookService, CategoryService],
})
export class BookModule {}
