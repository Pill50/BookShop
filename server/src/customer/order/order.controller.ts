import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser, ResponseMessage } from 'src/common/decorators';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { OrderDto } from './dto/order.dto';

@Controller('order')
@UseInterceptors(ResTransformInterceptor)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Create order successfully')
  async createOrder(
    @GetCurrentUser('id') userId: string,
    @Body() orderData: OrderDto,
  ) {
    return await this.orderService.createOrder(userId, orderData);
  }
}
