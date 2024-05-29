import {
  Body,
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
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';

@Controller('admin/category')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @Render('category/index')
  async rendergGetAllCategories(@Query('page') page: string) {
    const pageIndex: number = page ? parseInt(page as string, 10) : 1;
    const categoryList = await this.categoryService.getAllCategories(pageIndex);

    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === categoryList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? categoryList.totalPage : pageIndex - 1,
    };

    return { categoryList, pagination };
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
    if (newCategory && file) {
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
