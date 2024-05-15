import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OAuthDto } from './dto/OAuth.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/resendConfirmation.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RefreshTokensDto } from './dto/refreshTokens.dto';
import { TokenDto } from './dto/token.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { User } from './entities/User.entity';
import { Payload } from './types';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import { Tokens } from './entities/Token.entity';
import {
  ConfirmEmailResponse,
  LoginResponse,
  LogoutResponse,
} from './entities/Response.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async oauth(@Args('oauthInput') oauthDto: OAuthDto) {
    return this.authService.OAuth(oauthDto);
  }

  @Mutation(() => Boolean)
  async register(@Args('registerInput') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Mutation(() => ConfirmEmailResponse)
  async confirmEmail(@Args('tokenInput') tokenInput: TokenDto) {
    return this.authService.confirmEmail(tokenInput);
  }

  @Mutation(() => String)
  async resendConfirmation(
    @Args('confirmEmailInput') confirmEmailDto: ConfirmEmailDto,
  ) {
    return this.authService.resendConfirmation(confirmEmailDto);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(JwtAuthGuard)
  async logout(@GetCurrentUser('id') id: string) {
    return this.authService.logout(id);
  }

  @Query(() => User)
  async getMe(@GetCurrentUser() user: Payload) {
    return user;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordDto: ForgotPasswordDto,
  ) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return true;
  }

  @Mutation(() => User)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => User)
  async changePassword(
    @GetCurrentUser('id') userId: string,
    @Args('changePasswordInput') changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }

  @Mutation(() => Tokens)
  async refreshTokens(
    @Args('refreshTokensInput') refreshTokensDto: RefreshTokensDto,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(refreshTokensDto);
  }

  @Mutation(() => Boolean)
  async checkValid(@Args('tokenInput') tokenDto: TokenDto) {
    return this.authService.checkValidToken(tokenDto);
  }
}
