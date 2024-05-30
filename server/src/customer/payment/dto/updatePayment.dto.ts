import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsNotEmpty({ message: 'Payment id must not empty' })
  @IsString({ message: 'Payment id must be a string' })
  paymentId: string;

  @IsNotEmpty({ message: 'Transaction id must not empty' })
  @IsString({ message: 'Transaction id must be a string' })
  transactionId: string;
}
