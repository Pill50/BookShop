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
