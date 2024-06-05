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
import { PromotionService } from './promotion.service';
import { PromotionType, Role } from '@prisma/client';
import { PromotionDto } from './dto/promotion.dto';
import { Response } from 'express';
import { FilterPromotionDto } from './dto/filterPromotion.dto';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Roles } from 'src/common/decorators';

@Controller('admin/promotion')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('/update/:id')
  @Render('promotion/update')
  async renderUpdatePromotion(@Req() req: any, @Param('id') id: string) {
    try {
      const promotion = await this.promotionService.getPromotionById(id);
      const formattedStartDate = promotion.startDate.toISOString().slice(0, 10);
      const formattedEndDate = promotion.endDate.toISOString().slice(0, 10);

      return {
        promotion: { ...promotion, formattedStartDate, formattedEndDate },
      };
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('')
  @Render('promotion/index')
  async renderAllPromotions(@Query() filter: FilterPromotionDto) {
    const pageIndex: number | 1 = filter.page
      ? parseInt(filter.page as string, 10)
      : 1;
    const type = filter.type ? filter.type : undefined;

    const tab = type ? type : 'SALE';
    const statistic = await this.promotionService.getStatisticPromotion();

    if (tab === 'SALE') {
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

      return { onSaleList, pagination, tab, statistic };
    } else if (tab === 'POPULAR') {
      const popularList = await this.promotionService.getPopularList();
      return { popularList, tab, statistic };
    } else if (tab === 'RECOMMEND') {
      const recommendList = await this.promotionService.getRecommendList();
      return { recommendList, tab, statistic };
    }
  }

  @Get('/create')
  @Render('promotion/create')
  async renderCreatePromotion() {}

  @Post('/create')
  async createPromotion(
    @Query('bookId') bookId: string,
    @Body() body: PromotionDto,
    @Res() res: Response,
  ) {
    const data: PromotionDto = {
      type: body.type || 'SALE',
      startDate: new Date(body.startDate).toISOString(),
      endDate: new Date(body.endDate).toISOString(),
      discountFlashSale: Number(body?.discountFlashSale) || null,
    };
    const promotion = await this.promotionService.createNewPromotion(
      bookId,
      data,
    );
    if (promotion) {
      res.redirect(`/admin/book/${bookId}`);
    }
  }

  @Post('/update/:id')
  @Render('promotion/update')
  async updatePromotion(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: any,
    @Req() req: any,
  ) {
    try {
      const updatedPromotion = await this.promotionService.updatePromotion(
        id,
        body.type || 'SALE',
        new Date(body.startDate).toISOString(),
        new Date(body.endDate).toISOString(),
      );

      if (updatedPromotion) {
        req.session.success_msg = 'Update promotion successfully';
      } else {
        req.session.error_msg = 'You can not update promotion!';
      }
      res.redirect('/admin/promotion');
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }

  @Get('/delete/:id')
  async deletePromotion(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const deletedPromotion = await this.promotionService.deletePromotion(id);
      if (deletedPromotion) {
        req.session.success_msg = 'Delete promotion successfully';
        res.redirect('/admin/promotion');
      }
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }
}
