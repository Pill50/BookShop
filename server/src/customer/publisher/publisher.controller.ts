import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators';

@Controller('publisher')
@UseInterceptors(ResTransformInterceptor)
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved shippers successfully')
  async getAllPublishers() {
    return await this.publisherService.getAllPublishers();
  }
}
