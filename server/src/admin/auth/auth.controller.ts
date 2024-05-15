import { Controller, Get, Render } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('auth/login')
  login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    return {
      viewData: viewData,
    };
  }

  @Get('/register')
  @Render('auth/register')
  register() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    return {
      viewData: viewData,
    };
  }
}
