import { PromotionType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PromotionDto {
  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type must not be empty' })
  type: PromotionType;

  @IsString({ message: 'Start date must be a string' })
  @IsNotEmpty({ message: 'Start date must not be empty' })
  startDate: string;

  @IsString({ message: 'End date must be a string' })
  @IsNotEmpty({ message: 'End date must not be empty' })
  endDate: string;

  @IsOptional()
  discountFlashSale?: number;
}
