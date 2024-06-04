import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('category')
@UseInterceptors(ResTransformInterceptor)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved category successfully')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
