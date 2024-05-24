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
import { PublisherService } from './publisher.service';
import { Response } from 'express';
import { Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { SessionGuard } from 'src/common/guard/session.guard';

@Controller('admin/publisher')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('/')
  @Render('publisher/index')
  async renderPublisher(@Query('page') page: string) {
    const publisherList = await this.publisherService.getAllPublishers();

    const pageIndex: number = page ? parseInt(page as string, 10) : 1;
    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === publisherList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? publisherList.totalPage : pageIndex - 1,
    };
    return { publisherList, pagination };
  }

  @Post('/create')
  async createPublisher(@Body() body, @Res() res: Response, @Req() req: any) {
    try {
      await this.publisherService.createPublisher(body.name);
      req.session.success_msg = 'Create publisher successfully';
      res.redirect('/admin/publisher');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Post('/update/:id')
  async updatePublisher(
    @Body() body,
    @Res() res: Response,
    @Req() req: any,
    @Param('id') id: string,
  ) {
    try {
      await this.publisherService.updatePublisher(id, body.name);
      req.session.success_msg = 'Update publisher successfully';
      res.redirect('/admin/publisher');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/delete/:id')
  async deletePublisher(
    @Req() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      await this.publisherService.deletePublisher(id);
      req.session.success_msg = 'Delete publisher successfully';
      res.redirect('/admin/publisher');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }
}
