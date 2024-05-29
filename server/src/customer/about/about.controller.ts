import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators';

@Controller('about')
@UseInterceptors(ResTransformInterceptor)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get about content successfully')
  async getAboutPageContent() {
    return this.aboutService.getAboutPageContent();
  }
}
