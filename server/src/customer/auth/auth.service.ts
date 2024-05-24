import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtError } from 'src/common/errors/jwtError.enum';
import { AuthError } from 'src/common/errors/authError.enum';
import { OAuthDto } from './dto/OAuth.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/resendConfirmation.dto';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RefreshTokensDto } from './dto/refreshTokens.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { Limit, Payload, Role, sendMailOptions, Status, Gender } from './types';
import { exceptionHandler } from 'src/common/errors';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async OAuth(OAuthDto: OAuthDto) {
    try {
      const { authId, avatar, displayName, email, loginFrom } = OAuthDto;

      let user = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          role: true,
          avatar: true,
          address: true,
          phone: true,
          gender: true,
          displayName: true,
          status: true,
        },
      });

      if (!user) {
        user = await this.prismaService.users.create({
          data: {
            email: email,
            authId: authId,
            displayName: displayName,
            isLogin: true,
            role: Role.Customer,
            avatar: avatar,
            status: Status.ACTIVE,
            loginFrom: loginFrom,
          },
        });
      }

      if (user.status === Status.INACTIVE) {
        user = await this.prismaService.users.update({
          where: {
            id: user.id,
          },
          data: {
            email: email,
            authId: authId,
            displayName: displayName,
            password: null,
            isLogin: true,
            role: Role.Customer,
            avatar: avatar,
            status: Status.ACTIVE,
            loginFrom: loginFrom,
          },
        });
      }

      const payload: Payload = {
        id: user.id,
        email: user.email,
        role: user.role as Role,
        displayName: user.displayName,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        gender: user.gender as Gender,
        status: Status.ACTIVE,
      };

      const tokens = await this.generateTokens(payload);
      await this.updateTokens(
        user.id,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        true,
      );

      return {
        ...tokens,
        user: {
          ...payload,
        },
      };
    } catch (err) {
      throw new Error(err.message);
      // throw new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, confirmPassword, displayName } = registerDto;

      if (password !== confirmPassword) {
        throw new HttpException(
          'Password do not match confirm password',
          HttpStatus.BAD_REQUEST,
        );
      }

      let userExists = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
      });

      if (userExists && userExists.status === Status.ACTIVE) {
        throw new HttpException(
          'User is already activate login',
          HttpStatus.BAD_REQUEST,
        );
      } else if (userExists && userExists.status === Status.INACTIVE) {
        throw new HttpException(
          'User do not activate account',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const hashPassword = await this.hashData(password);
        const newUser = await this.prismaService.users.create({
          data: {
            email: email,
            password: hashPassword,
            displayName: displayName,
            isLogin: false,
            status: Status.INACTIVE,
            role: Role.Customer,
          },
        });

        const confirmToken = await this.generateUserIdToken(newUser.id);

        await this.updateConfirmToken(newUser.id, confirmToken);
        const sendMailOptions: sendMailOptions = {
          to: newUser.email,
          subject: '[TVP Book Shop Confirmation]',
          displayName: newUser.displayName,
          token: confirmToken,
          type: 'confirm',
        };

        await this.mailerService.sendMail(sendMailOptions);
        return true;
      }
    } catch (err) {
      throw new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async confirmEmail(dto: TokenDto) {
    try {
      const { token } = dto;
      const decoded = await this.verifyToken(token);

      const user = await this.prismaService.users.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          status: true,
          confirmToken: true,
        },
      });

      if (!user) {
        throw new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      }

      if (user.status === Status.ACTIVE) {
        throw new HttpException(
          AuthError.USER_ALREADY_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.status === Status.BLOCKED) {
        throw new HttpException(AuthError.USER_BLOCKED, HttpStatus.BAD_REQUEST);
      }
      if (user.confirmToken !== token) {
        throw new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      }
      const updatedUser = await this.prismaService.users.update({
        where: {
          id: user.id,
        },
        data: {
          status: Status.ACTIVE,
          confirmToken: null,
        },
      });
      const payload: Payload = {
        email: updatedUser.email,
        id: updatedUser.id,
        role: updatedUser.role as Role,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        address: updatedUser.address,
        phone: updatedUser.phone,
        gender: updatedUser.gender as Gender,
        status: updatedUser.status,
      };
      const tokens = await this.generateTokens(payload);
      await this.updateTokens(
        user.id,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        true,
      );
      return {
        ...tokens,
        user: updatedUser,
      };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async login(dto: LoginDto) {
    try {
      const { email, password } = dto;
      const user = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
        select: {
          email: true,
          id: true,
          password: true,
          role: true,
          displayName: true,
          avatar: true,
          status: true,
          address: true,
          phone: true,
          gender: true,
          authId: true,
          attempts: true,
        },
      });

      if (!user) {
        throw new HttpException(
          AuthError.USER_INVALID_CREDENTIALS,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.status === Status.INACTIVE) {
        throw new HttpException(
          AuthError.USER_NOT_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.status === Status.BLOCKED) {
        throw new HttpException(AuthError.USER_BLOCKED, HttpStatus.BAD_REQUEST);
      }
      if (user.authId !== null) {
        throw new HttpException(
          AuthError.USER_OAUTH_LOGIN,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isPasswordValid = await this.verifyHash(user.password, password);

      if (!isPasswordValid) {
        const updatedUser = await this.prismaService.users.update({
          where: {
            id: user.id,
          },
          data: {
            attempts: user.attempts + 1,
          },
        });
        if (updatedUser.attempts >= Limit.MAX_ATTEMPTS) {
          await this.prismaService.users.update({
            where: {
              id: user.id,
            },
            data: {
              status: Status.BLOCKED,
            },
          });
          throw new HttpException(
            AuthError.USER_BLOCKED,
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new HttpException(
          `${AuthError.USER_INVALID_CREDENTIALS}, you have ${
            Limit.MAX_ATTEMPTS - updatedUser.attempts
          } attempts left`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload: Payload = {
        email: user.email,
        id: user.id,
        role: user.role as Role,
        displayName: user.displayName,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        gender: user.gender as Gender,
        status: user.status,
      };
      const tokens = await this.generateTokens(payload);
      await this.updateTokens(
        user.id,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        true,
      );
      await this.updateAttempts(user.id, 0);
      return {
        ...tokens,
        user: payload,
      };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async logout(userId: string) {
    try {
      await this.updateTokens(
        userId,
        {
          accessToken: null,
          refreshToken: null,
        },
        true,
      );
      return {
        accessToken: '',
        refreshToken: '',
      };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const { email } = dto;
      const user = await this.prismaService.users.findUnique({
        where: {
          email: email,
        },
        select: {
          email: true,
          id: true,
          displayName: true,
          status: true,
          authId: true,
        },
      });
      if (!user) {
        throw new HttpException(
          AuthError.USER_EMAIL_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.status === Status.INACTIVE) {
        throw new HttpException(
          AuthError.USER_NOT_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.authId !== null) {
        throw new HttpException(
          AuthError.USER_OAUTH_CHANGE_PASSWORD,
          HttpStatus.BAD_REQUEST,
        );
      }
      const resetToken = await this.generateUserIdToken(user.id);
      await this.updateResetToken(user.id, resetToken);
      const sendMailOptions: sendMailOptions = {
        to: user.email,
        subject: '[TVPBookShop Reset Password]',
        displayName: user.displayName,
        token: resetToken,
        type: 'reset',
      };
      await this.mailerService.sendMail(sendMailOptions);
      return 'Reset password link sent successfully';
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const { password, confirmPassword, token } = dto;
      if (password !== confirmPassword) {
        throw new HttpException(
          AuthError.USER_PASSWORDS_NOT_MATCH,
          HttpStatus.BAD_REQUEST,
        );
      }

      const decoded = await this.verifyToken(token);

      const user = await this.prismaService.users.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          status: true,
          resetToken: true,
        },
      });
      if (!user) {
        throw new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      }
      if (user.status === Status.INACTIVE) {
        throw new HttpException(
          AuthError.USER_NOT_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.resetToken !== token) {
        throw new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await this.hashData(dto.password);
      const updatedUser = await this.prismaService.users.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetToken: null,
          status: Status.ACTIVE,
        },
      });
      const payload: Payload = {
        email: updatedUser.email,
        id: updatedUser.id,
        role: updatedUser.role as Role,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        address: updatedUser.address,
        phone: updatedUser.phone,
        gender: updatedUser.gender as Gender,
        status: updatedUser.status,
      };
      const tokens = await this.generateTokens(payload);
      await this.updateTokens(
        user.id,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        true,
      );
      await this.updateAttempts(user.id, 0);
      return {
        ...tokens,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
          address: updatedUser.address,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          status: updatedUser.status,
        },
      };
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async changePassword(dto: ChangePasswordDto, userId: string) {
    try {
      const { oldPassword, newPassword, confirmPassword } = dto;
      if (newPassword !== confirmPassword) {
        throw new HttpException(
          AuthError.USER_PASSWORDS_NOT_MATCH,
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.prismaService.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          password: true,
          loginFrom: true,
        },
      });
      if (!user) {
        throw new HttpException(
          AuthError.USER_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.loginFrom !== null) {
        throw new HttpException(
          AuthError.USER_OAUTH_CHANGE_PASSWORD,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isPasswordValid = await this.verifyHash(user.password, oldPassword);
      if (!isPasswordValid) {
        throw new HttpException(
          AuthError.USER_OLD_PASSWORD_INVALID,
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await this.hashData(newPassword);
      await this.prismaService.users.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return 'Password changed successfully';
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async refreshTokens(dto: RefreshTokensDto) {
    try {
      const { refreshToken } = dto;
      const decoded = await this.verifyToken(refreshToken);
      const user = await this.prismaService.users.findFirst({
        where: {
          id: decoded.id,
          refreshToken: refreshToken,
        },
        select: {
          email: true,
          id: true,
          role: true,
          displayName: true,
          avatar: true,
          address: true,
          phone: true,
          gender: true,
          status: true,
        },
      });
      if (!user) {
        throw new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
      }
      if (user.status === Status.INACTIVE) {
        throw new HttpException(
          AuthError.USER_NOT_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.status === Status.BLOCKED) {
        throw new HttpException(AuthError.USER_BLOCKED, HttpStatus.BAD_REQUEST);
      }
      const payload: Payload = {
        email: user.email,
        id: user.id,
        role: user.role as Role,
        displayName: user.displayName,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        gender: user.gender as Gender,
        status: user.status,
      };
      const tokens = await this.generateTokens(payload);
      await this.updateTokens(
        user.id,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        true,
      );
      return tokens;
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async updateResetToken(userId: string, token: string) {
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        resetToken: token,
      },
    });
  }

  async updateAttempts(userId: string, attempts: number) {
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        attempts: attempts,
      },
    });
  }

  async checkValidToken(dto: TokenDto) {
    const { token } = dto;
    try {
      const decoded = await this.verifyToken(token);
      if (!decoded) {
        return {
          status: false,
          message: JwtError.INVALID_TOKEN,
        };
      }
      return {
        status: true,
        message: 'Token is valid',
      };
    } catch (err) {
      if (err.name === JwtError.TOKEN_EXPIRED_ERROR) {
        return {
          status: false,
          message: JwtError.ACCESS_TOKEN_EXPIRED,
        };
      }
      return {
        status: false,
        message: JwtError.INVALID_TOKEN,
      };
    }
  }

  async generateTokens(payload: Payload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
      privateKey: process.env.PRIVATE_KEY,
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_TTL,
      privateKey: process.env.PRIVATE_KEY,
      secret: process.env.JWT_SECRET,
    });
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
      publicKey: process.env.PUBLIC_KEY,
    });
  }

  async updateTokens(
    userId: string,
    {
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    },
    isLogin: boolean,
  ) {
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isLogin,
      },
    });
  }

  async generateUserIdToken(userId: string) {
    const token = await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: process.env.CONFIRM_TOKEN_TTL,
        privateKey: process.env.PRIVATE_KEY,
        secret: process.env.JWT_SECRET,
      },
    );
    return token;
  }

  async updateConfirmToken(userId: string, confirmToken: string) {
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        confirmToken: confirmToken,
      },
    });
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }

  async verifyHash(hashedData: string, plainData: string) {
    return await argon2.verify(hashedData, plainData);
  }
}
