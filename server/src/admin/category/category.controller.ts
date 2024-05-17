import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('admin/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @Render('category/index')
  async rendergGetAllCategories() {
    const categoryList = await this.categoryService.getAllCategories();
    return { categoryList };
  }

  @Get('/create')
  @Render('category/create')
  async renderCreateCategory() {
    const categoryList = await this.categoryService.getAllCategories();
    return { categoryList };
  }

  @Get('/update/:id')
  @Render('category/update')
  async renderUpdateCategory(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    return { category };
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @Req() req,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const newCategory = await this.categoryService.createCategory(
      req.body.title,
    );
    if (newCategory) {
      await this.categoryService.uploadThumbnail(file, newCategory.id);
    }

    res.redirect('/admin/category');
  }

  @Post('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Res() res: Response,
  ) {
    await this.categoryService.updateCategory(id, body.title, file);
    res.redirect('/admin/category');
  }

  @Get('/delete/:id')
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.deleteCategory(id);
    res.redirect('/admin/category');
  }
}
