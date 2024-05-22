import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderDetailDto } from './orderDetail.dto';

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

  @IsNotEmpty({ message: 'Receiver name must not be empty' })
  @IsString()
  receiverName: string;

  @IsNotEmpty({ message: 'Receiver phone number must not be empty' })
  @IsString()
  receiverPhone: string;

  @IsNotEmpty({ message: 'Address must not be empty' })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty({ message: 'Order item must not be empty' })
  orderItem: OrderDetailDto[];
}
