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
// @UseGuards(SessionGuard)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('')
  @Render('promotion/index')
  async renderAllPromotions(@Query() filter: FilterPromotionDto) {
    const pageIndex: number | 1 = filter.page
      ? parseInt(filter.page as string, 10)
      : 1;
    const type: PromotionType | undefined = filter.type
      ? filter.type
      : undefined;

    const promotionList = await this.promotionService.getAllPromotions(
      pageIndex,
      type,
    );

    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === promotionList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? promotionList.totalPage : pageIndex - 1,
    };

    const statistic = await this.promotionService.getStatisticPromotion();

    const tab = type ? type : 'ALL';

    return { promotionList, pagination, tab, statistic };
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
      type: body.type,
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

  @Get('/update/:id')
  @Render('promotion/update')
  async renderUpdatePromotion(@Param('id') id: string) {
    const promotion = await this.promotionService.getPromotionById(id);
    return { promotion };
  }

  @Post('/update/:id')
  @Render('promotion/update')
  async updatePromotion(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const updatedPromotion = await this.promotionService.updatePromotion(
      id,
      body.type,
      body.startDate,
      body.endDate,
    );
    return { updatedPromotion };
  }

  @Get('/delete/:id')
  async deletePromotion(@Param('id') id: string, @Res() res: Response) {
    const deletedPromotion = await this.promotionService.deletePromotion(id);
    return { deletedPromotion };
  }
}
