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
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { Response } from 'express';
import { Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { SessionGuard } from 'src/common/guard/session.guard';

@Controller('admin/author')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('/')
  @Render('author/index')
  async renderAuthor(@Query('page') page: string) {
    const pageIndex: number = page ? parseInt(page as string, 10) : 1;
    const authorList = await this.authorService.getAllAuthors(pageIndex);
    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === authorList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? authorList.totalPage : pageIndex - 1,
    };

    return { authorList, pagination };
  }

  @Post('/create')
  async createAuthor(@Body() body, @Res() res: Response, @Req() req: any) {
    try {
      await this.authorService.createAuthor(body.name);
      req.session.success_msg = 'Create author successfully';
      res.redirect('/admin/author');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Post('/update/:id')
  async updateAuthor(
    @Body() body,
    @Res() res: Response,
    @Req() req: any,
    @Param('id') id: string,
  ) {
    try {
      await this.authorService.updateAuthor(id, body.name);
      req.session.success_msg = 'Update author successfully';
      res.redirect('/admin/author');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/delete/:id')
  async deleteAuthor(
    @Req() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      await this.authorService.deleteAuthor(id);
      req.session.success_msg = 'Delete Author successfully';
      res.redirect('/admin/author');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }
}
