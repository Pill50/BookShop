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
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Response } from 'express';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookDto } from './dto/book.dto';

@Controller('admin/book')
export class BookController {
  constructor(
    private bookService: BookService,
    private categorySerive: CategoryService,
  ) {}

  @Get('/')
  @Render('book/index')
  async renderAllBooks(@Res() res: Response, @Query() filter: FilterBookDto) {
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
  async renderCreateBook() {
    const categories = await this.categorySerive.getAllCategories();
    return { categories };
  }

  @Get('/:id')
  @Render('book/book-detail')
  async renderBookDetail(@Param('id') id: string) {
    const book = await this.bookService.getBookById(id);
    return { book };
  }

  @Get('/update/:id')
  @Render('book/update')
  async renderUpdateBook(@Param('id') id: string) {
    const book = await this.bookService.getBookById(id);
    const categories = await this.categorySerive.getAllCategories();
    return { book, categories };
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createBook(
    @Req() req,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
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
    res.redirect('/admin/book');
  }

  @Post('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateBook(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
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

    res.redirect('/admin/book');
  }

  @Get('/delete/:id')
  async deleteBook(@Param('id') id: string, @Res() res: Response) {
    await this.bookService.deleteBook(id);
    res.redirect('/admin/book');
  }
}
