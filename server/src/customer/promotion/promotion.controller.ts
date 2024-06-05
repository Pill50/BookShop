import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { FilterPromotionDto } from './dto/filterPromotion.dto';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('promotion')
@UseInterceptors(ResTransformInterceptor)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async deleteExpiredPromotions() {
    console.log('Checking for expired promotions...');

    const expiredPromotions =
      await this.promotionService.findExpiredPromotions();

    if (expiredPromotions.length > 0) {
      console.log('Deleting expired promotions:', expiredPromotions);
      expiredPromotions.forEach(async (promotion) => {
        await this.promotionService.deletePromotions(promotion.id);
      });
    } else {
      console.log('No expired promotions found.');
    }
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved promotion successfully')
  async filterPromotions(@Query() filter: FilterPromotionDto) {
    const pageIndex: number | 1 = filter.page
      ? parseInt(filter.page as string, 10)
      : 1;
    const type = filter.type ? filter.type : 'SALE';

    if (type === 'SALE') {
      const onSaleList = await this.promotionService.getAllOnSaleItems(
        pageIndex,
        type,
      );

      const pagination = {
        totalPage: onSaleList.totalPage,
        currentPage: pageIndex,
        nextPage: pageIndex === onSaleList.totalPage ? 1 : pageIndex + 1,
        previousPage: pageIndex === 1 ? onSaleList.totalPage : pageIndex - 1,
      };

      return { onSaleList, pagination };
    } else if (type === 'POPULAR') {
      const popularList = await this.promotionService.getPopularList();
      return { popularList, type };
    } else if (type === 'RECOMMEND') {
      const recommendList = await this.promotionService.getRecommendList();
      return { recommendList, type };
    }
  }
}
