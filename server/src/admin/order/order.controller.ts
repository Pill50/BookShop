import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from '@prisma/client';
import { Response } from 'express';

@Controller('admin/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('')
  @Render('order/index')
  async renderAllOrders(@Query('page') page: string) {
    const pageIndex: number = page ? parseInt(page as string, 10) : 1;

    const orderList = await this.orderService.getAllOrders(pageIndex);

    const pagination = {
      currentPage: pageIndex,
      nextPage: pageIndex === orderList.totalPage ? 1 : pageIndex + 1,
      previousPage: pageIndex === 1 ? orderList.totalPage : pageIndex - 1,
    };

    return { orderList, pagination };
  }

  @Get('/:id')
  @Render('order/order_detail')
  async renderOrderById(@Param('id') id: string, @Res() res: Response) {
    const order = await this.orderService.getOrderById(id);
    const totalBook = order.orderDetail.reduce(
      (acc, orderItem) => acc + orderItem.amount,
      0,
    );
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
