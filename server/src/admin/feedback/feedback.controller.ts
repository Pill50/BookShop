import { Controller, Get, Render } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('admin/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/')
  @Render('feedback/index')
  async rendergGetAllCategories() {
    const feedbackList = await this.feedbackService.getAllFeedbacks();
    console.log(feedbackList);
    return { feedbackList };
  }
}
