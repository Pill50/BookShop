import { PromotionType } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class FilterPromotionDto {
  @IsOptional()
  page: string;

  @IsOptional()
  type: PromotionType;
}
