import { FilterBookDto } from './dto/filterBook.dto';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Response } from 'express';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookDto } from './dto/book.dto';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';

@Controller('admin/book')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class BookController {
  constructor(
    private bookService: BookService,
    private categorySerive: CategoryService,
  ) {}

  @Get('/')
  @Render('book/index')
  async renderAllBooks(@Query() filter: FilterBookDto) {
    const pageIndex: number | undefined = filter.page
      ? parseInt(filter.page as string, 10)
      : 1;
    const keyword: string | undefined = filter.keyword
      ? (filter.keyword as string)
      : undefined;
    const publisherId: string[] | undefined = filter.publisherId
      ? (filter.publisherId.split(',') as string[])
      : undefined;
    const categories: string[] | undefined = filter.categories
      ? (filter.categories.split(',') as string[])
      : undefined;
    const sortByPrice: string | undefined = filter.sortByPrice
      ? (filter.sortByPrice as string)
      : undefined;
    const sortBySoldAmount: string | undefined = filter.sortBySoldAmount
      ? (filter.sortBySoldAmount as string)
      : undefined;
    const sortByDate: string | undefined = filter.sortByDate
      ? (filter.sortByDate as string)
      : undefined;

    const bookList = await this.bookService.getAllBooks(
      pageIndex,
      keyword,
      publisherId,
      categories,
      sortByPrice,
      sortBySoldAmount,
      sortByDate,
    );

    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === bookList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? bookList.totalPage : pageIndex - 1,
    };
    return { bookList, pagination };
  }

  @Get('/create')
  @Render('book/create')
  async renderCreateBook(@Req() req: any) {
    try {
      const categories = await this.categorySerive.getAllCategories();
      return { categories };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/:id')
  @Render('book/book-detail')
  async renderBookDetail(@Req() req: any, @Param('id') id: string) {
    try {
      const book = await this.bookService.getBookById(id);
      return { book };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/update/:id')
  @Render('book/update')
  async renderUpdateBook(@Req() req: any, @Param('id') id: string) {
    try {
      const book = await this.bookService.getBookById(id);
      const categories = await this.categorySerive.getAllCategories();
      return { book, categories };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createBook(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const data: BookDto = {
        title: req.body.title,
        slug: req.body.title,
        amount: Number(req.body.amount),
        authorName: req.body.author,
        publisherName: req.body.publisher,
        description: req.body.description,
        discount: Number(req.body.discount),
        price: Number(req.body.price),
        categories: req.body.categories,
      };

      const response = await this.bookService.createBook(data);
      if (response) {
        await this.bookService.uploadThumbnail(file, response.book.id);
      }
      req.session.success_msg = 'Create book successfully';
      res.redirect('/admin/book');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Post('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateBook(
    @Req() req: any,
    @Res() res: Response,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const data: BookDto = {
        title: req.body.title,
        slug: req.body.title,
        amount: Number(req.body.amount),
        authorName: req.body.author,
        publisherName: req.body.publisher,
        description: req.body.description,
        discount: Number(req.body.discount),
        price: Number(req.body.price),
        categories: req.body.categories,
      };

      await this.bookService.updateBook(id, file, data);

      req.session.success_msg = 'Update book successfully';
      res.redirect('/admin/book');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/delete/:id')
  async deleteBook(
    @Req() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      await this.bookService.deleteBook(id);
      req.session.success_msg = 'Delete Book successfully';
      res.redirect('/admin/book');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }
}
