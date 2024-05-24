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
import { AuthResponse, LogoutResponse } from './entities/Response.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async oauth(@Args('oauthInput') oauthInput: OAuthDto) {
    return this.authService.OAuth(oauthInput);
  }

  @Mutation(() => Boolean)
  async register(@Args('registerInput') registerInput: RegisterDto) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async confirmEmail(@Args('tokenInput') tokenInput: TokenDto) {
    return this.authService.confirmEmail(tokenInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(JwtAuthGuard)
  async logout(@GetCurrentUser('id') id: string) {
    return this.authService.logout(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getMe(@GetCurrentUser() user: Payload) {
    return user;
  }

  @Mutation(() => String)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => AuthResponse)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetCurrentUser('id') id: string,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordInput, id);
  }

  @Mutation(() => Tokens)
  async refreshTokens(
    @Args('refreshTokensInput') refreshTokensInput: RefreshTokensDto,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(refreshTokensInput);
  }

  @Mutation(() => Boolean)
  async checkValid(@Args('tokenInput') tokenDto: TokenDto) {
    return this.authService.checkValidToken(tokenDto);
  }
}
