import { Controller, Get, Render, Req } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/about')
  @Render('about')
  aboutPage() {
    return { message: 'About page' };
  }

  @Get('/feedback')
  @Render('feedback/manageFeedback')
  manageFeedbackPage() {
    return { message: 'Feedback page' };
  }
}
