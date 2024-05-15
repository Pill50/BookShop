import { Controller, Get, Render } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Render('home')
  root() {
    return { message: 'Hello world!' };
  }

  @Get('/about')
  @Render('about')
  aboutPage() {
    return { message: 'About page' };
  }

  @Get('/book')
  @Render('book/manageBook')
  manageBookPage() {
    return { message: 'About page' };
  }

  @Get('/category')
  @Render('category/manageCategory')
  manageCategoryPage() {
    return { message: 'Category page' };
  }

  @Get('/feedback')
  @Render('feedback/manageFeedback')
  manageFeedbackPage() {
    return { message: 'Feedback page' };
  }

  @Get('/order')
  @Render('order/manageOrder')
  manageOrderPage() {
    return { message: 'Order page' };
  }

  @Get('/promotion')
  @Render('Promotion/managePromotion')
  managePromotionPage() {
    return { message: 'Promotion page' };
  }
}
