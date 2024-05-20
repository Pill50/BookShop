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
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionType } from '@prisma/client';
import { PromotionDto } from './dto/promotion.dto';
import { Response } from 'express';

@Controller('admin/promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('')
  @Render('promotion/index')
  async renderAllPromotions(
    @Res() res: Response,
    @Query('type') type: PromotionType,
  ) {
    let promotions: any;
    if (type) {
      promotions = await this.promotionService.getPromotionByType(type);
    }
    promotions = await this.promotionService.getAllPromotions();
    return { promotions };
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
      endDate: new Date(body.startDate).toISOString(),
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
