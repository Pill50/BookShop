import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderDetailDto } from './orderDetail.dto';
import { PaymentType } from '@prisma/client';

export class OrderDto {
  @IsNotEmpty({ message: 'Amount must not be empty' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Total price must not be empty' })
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  status: string = 'pending';

  @IsNotEmpty({ message: 'ShipperId must not be empty' })
  @IsString()
  shipperId: string;

  @IsNotEmpty({ message: 'Reciever name must not be empty' })
  @IsString()
  recieverName: string;

  @IsNotEmpty({ message: 'Reciever phone number must not be empty' })
  @IsString()
  recieverPhone: string;

  @IsNotEmpty({ message: 'Address must not be empty' })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty({ message: 'Payment method must not be empty' })
  @IsString()
  paymentMethod: PaymentType;

  @IsNotEmpty({ message: 'Order item must not be empty' })
  orderItem: OrderDetailDto[];
}
