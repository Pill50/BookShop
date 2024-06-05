import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ResponseMessage } from 'src/common/decorators';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('feedback')
@UseInterceptors(ResTransformInterceptor)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/:bookId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get feedback of books successfully')
  async getTop10Newest(@Param('bookId') bookId: string) {
    return await this.feedbackService.getBookFeedbacks(bookId);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Create feedback successfully')
  async createFeedback(@Body() feedbackData: FeedbackDto) {
    return await this.feedbackService.createFeedback(feedbackData);
  }
}
