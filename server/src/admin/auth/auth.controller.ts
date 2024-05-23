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

  @Post('/store')
  async store(@Res() response: Response, @Req() request: any) {
    const toValidate: string[] = ['email', 'password', 'confirmPassword'];
    const errors: string[] = UserValidator.validate(request.body, toValidate);
    if (errors.length > 0) {
      request.session.error_msg = errors;
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

    try {
      const userResponse = await this.authService.login(email, pass);
      request.session.user = {
        id: userResponse.id,
        name: userResponse.displayName,
        avatar: userResponse.avatar,
        role: userResponse.role,
      };
      request.session.error_msg = '';
      return response.redirect('/admin/book');
    } catch (err) {
      request.session.error_msg = err.message;
      return response.redirect('/admin/auth/login');
    }
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Req() request, @Res() response: Response) {
    request.session.user = null;
    request.session.error_msg = '';
    response.redirect('/admin/auth/login');
  }

  @Get('/clear-session-messages')
  async clearMessage(@Req() req: any) {
    req.session.error_msg = null;
    req.session.success_msg = null;
  }
}
