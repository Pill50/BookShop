import { IsOptional } from 'class-validator';

export class FilterBookDto {
  @IsOptional()
  keyword: string;

  @IsOptional()
  page: string;

  @IsOptional()
  publisherId: string;

  @IsOptional()
  categories: string;

  @IsOptional()
  sortByPrice: string;

  @IsOptional()
  sortBySoldAmount: string;

  @IsOptional()
  sortByDate: string;
}
