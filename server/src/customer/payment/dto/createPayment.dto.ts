import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString({ message: 'Title must be a string' })
  orderInfo: string;

  @IsString({ message: 'Title must be a string' })
  redirectUrl: string;

  @IsString({ message: 'Title must be a string' })
  ipnUrl: string;

  @IsString({ message: 'Title must be a string' })
  amount: number;

  @IsString({ message: 'Title must be a string' })
  extraData: string;
}
