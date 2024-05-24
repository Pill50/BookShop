import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { RolesGuard } from 'src/common/guard/role.guard';

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

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Create category successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCategory(@Body() category: CategoryDto) {
    return this.categoryService.createCategory(category);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update category successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateCategory(
    @Param('id') id: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() category: CategoryDto,
  ) {
    return this.categoryService.updateCategory(id, category, thumbnail);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Delete category successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Post('/upload-thumbnail')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Upload thumbnail successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Body('categoryId') categoryId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.categoryService.uploadThumbnail(thumbnail, categoryId);
  }
}
