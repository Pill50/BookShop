import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserValidator } from '../validators/user.validator';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('auth/login')
  login() {}

  @Get('/register')
  @Render('auth/register')
  register() {}

  @Post('/store')
  async store(@Res() response: Response, @Req() request: any) {
    const toValidate: string[] = ['email', 'password', 'confirmPassword'];
    const errors: string[] = UserValidator.validate(request.body, toValidate);
    if (errors.length > 0) {
      request.session.flashErrors = errors;
      return response.redirect('/auth/register');
    } else {
      await this.authService.createOrUpdate(
        request.body.email,
        request.body.password,
        request.body.confirmPassword,
      );
      return response.redirect('/admin/auth/login');
    }
  }

  @Post('/connect')
  async connect(@Body() body, @Req() request: any, @Res() response: Response) {
    const email = body.email;
    const pass = body.password;
    const user = await this.authService.login(email, pass);
    if (user) {
      request.session.user = {
        id: user.id,
        name: user.displayName,
        role: user.role,
      };
      return response.redirect('/admin/book');
    } else {
      return response.redirect('/admin/auth/login');
    }
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Req() request) {
    request.session.user = null;
  }
}
