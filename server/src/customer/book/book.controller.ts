import { ResponseMessage } from 'src/common/decorators';
import { BookService } from './book.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { FilterBookDto } from './dto/filterBook.dto';

@Controller('book')
@UseInterceptors(ResTransformInterceptor)
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/best-sellers')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved bestsellers successfully')
  async getTop10BestSelling() {
    return await this.bookService.getTop10BestSeller();
  }

  @Get('/newest')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved newest books successfully')
  async getTop10Newest() {
    return await this.bookService.getTop10Newest();
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved related books successfully')
  async getBookRelated(@Query('categories') categories: string) {
    const categoriesIds: string[] | undefined = categories.split(
      ',',
    ) as string[];

    return await this.bookService.getRelatedBooks(categoriesIds);
  }

  @Get('/statistic')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get statistic successfully')
  async getStatistic() {
    return this.bookService.getStatistics();
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get book successfully')
  async getBookBySlug(@Param('slug') slug: string) {
    return this.bookService.getBookBySlug(slug);
  }

  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get book successfully')
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved books successfully')
  async getAllBooks(@Query() filter: FilterBookDto) {
    const pageIndex: number | undefined = filter.page
      ? parseInt(filter.page as string, 10)
      : undefined;
    let keyword: string | undefined = filter.keyword
      ? (filter.keyword as string)
      : undefined;
    if (filter.keyword == 'null') {
      keyword = undefined;
    }
    const rating: number | undefined = filter.rating
      ? parseInt(filter.rating as string)
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

    return this.bookService.getAllBooks(
      pageIndex,
      rating,
      keyword,
      publisherId,
      categories,
      sortByPrice,
      sortBySoldAmount,
      sortByDate,
    );
  }
}
