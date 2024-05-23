import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CategoryService } from '../category/category.service';
import { AuthorService } from '../author/author.service';
import { PublisherService } from '../publisher/publisher.service';

@Module({
  controllers: [BookController],
  providers: [BookService, CategoryService, AuthorService, PublisherService],
})
export class BookModule {}
