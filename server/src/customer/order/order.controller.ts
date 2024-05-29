import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser, ResponseMessage } from 'src/common/decorators';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';

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

  @Put('/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Update order's status successfully")
  async updateStatusOrder(@Body() body: UpdateOrderStatusDto) {
    return await this.orderService.updateOrderStatus(body.orderId, body.status);
  }
}
