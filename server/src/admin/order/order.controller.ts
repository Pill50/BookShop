import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from '@prisma/client';
import { Response } from 'express';

@Controller('admin/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('')
  @Render('order/index')
  async renderAllOrders(@Res() res: Response) {
    const orders = await this.orderService.getAllOrders();
    return { orders };
  }

  @Get('/:id')
  @Render('order/order_detail')
  async renderOrderById(@Param('id') id: string, @Res() res: Response) {
    const order = await this.orderService.getOrderById(id);
    const totalBook = order.orderDetail.reduce(
      (acc, orderItem) => acc + orderItem.amount,
      0,
    );
    console.log(order);
    return { order, totalBook };
  }

  @Get('/update-status/:id')
  async updateStatusOrder(
    @Query('status') status: OrderStatus,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const response = await this.orderService.updateStatus(id, status);
    if (response) {
      res.redirect('/admin/order');
    }
  }
}
