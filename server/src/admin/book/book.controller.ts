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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Response } from 'express';
import { CategoryService } from '../category/category.service';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { BookDto } from './dto/book.dto';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AuthorService } from '../author/author.service';
import { PublisherService } from '../publisher/publisher.service';

@Controller('admin/book')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class BookController {
  constructor(
    private bookService: BookService,
    private categorySerive: CategoryService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
  ) {}

  @Get('/:id')
  @Render('book/book-detail')
  async renderBookDetail(@Req() req: any, @Param('id') id: string) {
    try {
      const book = await this.bookService.getBookById(id);
      const subImgList = await this.bookService.getBookSubImgs(id);
      return { book, subImgList };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/create')
  @Render('book/create')
  async renderCreateBook(@Req() req: any) {
    try {
      const categoryList = await this.categorySerive.getAllCategories();
      const authorList = await this.authorService.getAllAuthors();
      const publisherList = await this.publisherService.getAllPublishers();
      return { categoryList, authorList, publisherList };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/update/:id')
  @Render('book/update')
  async renderUpdateBook(@Req() req: any, @Param('id') id: string) {
    try {
      const book = await this.bookService.getBookById(id);
      const subImgList = await this.bookService.getBookSubImgs(id);
      const categoryList = await this.categorySerive.getAllCategories();
      const authorList = await this.authorService.getAllAuthors();
      const publisherList = await this.publisherService.getAllPublishers();

      return { book, categoryList, authorList, publisherList, subImgList };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'subImgs', maxCount: 3 },
    ]),
  )
  async createBook(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      subImgs?: Express.Multer.File[];
    },
  ) {
    try {
      const data: BookDto = {
        title: req.body.title,
        slug: req.body.title,
        amount: Number(req.body.amount),
        authorId: req.body.authorId,
        publisherId: req.body.publisherId,
        description: req.body.description,
        discount: Number(req.body.discount),
        price: Number(req.body.price),
        categories: JSON.parse(req.body.selectedCategories),
      };

      const response = await this.bookService.createBook(data);

      if (response) {
        if (files.thumbnail && files.thumbnail[0]) {
          await this.bookService.uploadThumbnail(
            files.thumbnail[0],
            response.book.id,
          );
        }
        if (files.subImgs) {
          for (const file of files.subImgs) {
            await this.bookService.uploadSubImage(file, response.book.id);
          }
        }
      }

      req.session.success_msg = 'Create book successfully';
      res.redirect('/admin/book');
    } catch (err) {
      req.session.error_msg = err.message;
      res.redirect('/admin/book/create');
    }
  }

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

  @Post('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'subImgs', maxCount: 3 },
    ]),
  )
  async updateBook(
    @Req() req: any,
    @Res() res: Response,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      subImgs?: Express.Multer.File[];
    },
  ) {
    try {
      const data: BookDto = {
        title: req.body.title,
        slug: req.body.title,
        amount: Number(req.body.amount),
        authorId: req.body.authorId,
        publisherId: req.body.publisherId,
        description: req.body.description,
        discount: Number(req.body.discount),
        price: Number(req.body.price),
        categories: req.body.categories,
      };

      if (files.thumbnail && files.thumbnail[0]) {
        await this.bookService.updateBook(id, files.thumbnail[0], data);
      } else {
        await this.bookService.updateBook(id, null, data);
      }

      if (files.subImgs) {
        for (const file of files.subImgs) {
          await this.bookService.uploadSubImage(file, id);
        }
      }

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
