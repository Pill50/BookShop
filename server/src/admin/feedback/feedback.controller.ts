import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';

@Controller('admin/feedback')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/')
  @Render('feedback/index')
  async rendergGetAllCategories(@Query('page') page: string) {
    const pageIndex: number = page ? parseInt(page as string, 10) : 1;

    const feedbackList = await this.feedbackService.getAllFeedbacks(pageIndex);
    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === feedbackList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? feedbackList.totalPage : pageIndex - 1,
    };

    return { feedbackList, pagination };
  }
}
