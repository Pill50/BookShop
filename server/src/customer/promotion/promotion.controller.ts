import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionType } from '@prisma/client';
import { FilterPromotionDto } from './dto/filterPromotion.dto';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators';

@Controller('promotion')
@UseInterceptors(ResTransformInterceptor)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved promotion successfully')
  async filterPromotions(@Query() filter: FilterPromotionDto) {
    const pageIndex: number | 1 = filter.page
      ? parseInt(filter.page as string, 10)
      : 1;
    const type: PromotionType | undefined = filter.type
      ? filter.type
      : undefined;

    return await this.promotionService.filterPromotions(pageIndex, type);
  }
}
