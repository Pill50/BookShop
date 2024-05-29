import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderDetailDto {
  @IsString()
  id: string;

  @IsString()
  orderId: string;

  @IsNotEmpty({ message: 'Amount must not be empty' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'Price must not be empty' })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty({ message: 'Order date must not be empty' })
  orderDate: Date;
}
