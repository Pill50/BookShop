import { OrderStatus } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Status must not be empty' })
  status: OrderStatus;

  @IsString()
  @IsNotEmpty({ message: 'Order id must not be empty' })
  orderId: string;
}
