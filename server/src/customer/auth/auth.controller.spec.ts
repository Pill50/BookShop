import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { Role, Status } from './types';
import { Gender } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { AuthError, JwtError } from 'src/common/errors';
import { OAuthDto } from './dto/OAuth.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let mailerService: MailerService;
  let userResponse = {
    address: 'Long An',
    avatar:
      'https://res.cloudinary.com/dnexchfxr/image/upload/v1713840788/samples/man-on-a-escalator.jpg',
    displayName: 'Vinh Phuc',
    email: 'user1@gmail.com',
    gender: Gender.MALE,
    id: '1',
    loginFrom: '',
    phone: '0123456789',
    role: Role.Customer,
    status: Status.ACTIVE,
    authId: '',
    password: '',
    isLogin: true,
    attempts: 0,
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    resetToken: 'resetToken',
    confirmToken: 'confirmToken',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: MailerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const mockRequest: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      displayName: 'Test User',
    };

    it('should successfully register a new user', async () => {
      const confirmToken = 'confirmationToken';

      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValueOnce(userResponse);
      jest
        .spyOn(service, 'generateUserIdToken')
        .mockResolvedValueOnce(confirmToken);
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(undefined);

      const result = await service.register(mockRequest);

      expect(result).toEqual(true);
      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: {
          email: mockRequest.email,
        },
      });
      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: mockRequest.email,
          password: expect.any(String),
          displayName: mockRequest.displayName,
          isLogin: false,
          status: Status.INACTIVE,
          role: Role.Customer,
        },
      });
      expect(service.generateUserIdToken).toHaveBeenCalledWith(userResponse.id);
      expect(mailerService.sendMail).toHaveBeenCalled();
    });

    it('should throw an error if password and confirmPassword do not match', async () => {
      await expect(
        service.register({
          ...mockRequest,
          confirmPassword: 'confirmPassword',
        }),
      ).rejects.toThrow(
        new HttpException(
          'Password do not match confirm password',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if the user already exists and is active', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      await expect(service.register(mockRequest)).rejects.toThrow(
        new HttpException(
          'User is already activate login',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if the user already exists and is inactive', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      await expect(service.register(mockRequest)).rejects.toThrow(
        new HttpException(
          'User is already activate login',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('login', () => {
    const mockRequest: LoginDto = {
      email: 'user1@gmail.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      jest
        .spyOn(AuthService.prototype, 'verifyHash')
        .mockResolvedValueOnce(true);

      jest
        .spyOn(AuthService.prototype, 'generateTokens')
        .mockResolvedValueOnce({
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        });

      const result = await service.login(mockRequest);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          email: mockRequest.email,
          id: '1',
          status: Status.ACTIVE,
          address: 'Long An',
          avatar:
            'https://res.cloudinary.com/dnexchfxr/image/upload/v1713840788/samples/man-on-a-escalator.jpg',
          displayName: 'Vinh Phuc',
          gender: Gender.MALE,
          phone: '0123456789',
          role: Role.Customer,
        },
      });
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        service.login({ ...mockRequest, email: 'user2@gmail.com' }),
      ).rejects.toThrow(AuthError.USER_INVALID_CREDENTIALS);
    });

    it('should throw an error if user is not activated', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.INACTIVE });

      await expect(service.login(mockRequest)).rejects.toThrow(
        AuthError.USER_NOT_ACTIVATED,
      );
    });

    it('should throw an error if user is blocked', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.BLOCKED });

      await expect(service.login(mockRequest)).rejects.toThrow(
        AuthError.USER_BLOCKED,
      );
    });

    it('should throw an error if user is using OAuth login', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, authId: 'authId' });

      await expect(service.login(mockRequest)).rejects.toThrow(
        AuthError.USER_OAUTH_LOGIN,
      );
    });

    it('should throw an error if password is incorrect', async () => {
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);
      jest.spyOn(service, 'verifyHash').mockResolvedValueOnce(false);

      await expect(
        service.login({ ...mockRequest, password: 'wrongPassword' }),
      ).rejects.toThrow(AuthError.USER_INVALID_CREDENTIALS);
    });
  });

  describe('oauth', () => {
    const mockRequest: OAuthDto = {
      authId: 'auth123',
      avatar: 'avatarUrl',
      displayName: 'Vinh Phuc',
      email: 'user1@gmail.com',
      loginFrom: 'google',
    };

    it('should create a new user if not found', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValueOnce({ ...userResponse, avatar: mockRequest.avatar });
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.OAuth(mockRequest);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'user1@gmail.com',
          role: Role.Customer,
          avatar: 'avatarUrl',
          address: 'Long An',
          phone: '0123456789',
          gender: Gender.MALE,
          displayName: 'Vinh Phuc',
          status: Status.ACTIVE,
        },
      });
    });

    it('should update an inactive user to active', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce({
        ...userResponse,
        status: Status.INACTIVE,
        avatar: mockRequest.avatar,
      });
      jest.spyOn(prismaService.users, 'update').mockResolvedValueOnce({
        ...userResponse,
        status: Status.ACTIVE,
        avatar: mockRequest.avatar,
      });
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.OAuth(mockRequest);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'user1@gmail.com',
          role: Role.Customer,
          avatar: 'avatarUrl',
          address: 'Long An',
          phone: '0123456789',
          gender: Gender.MALE,
          displayName: 'Vinh Phuc',
          status: Status.ACTIVE,
        },
      });
    });

    it('should return existing active user tokens', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce({
        ...userResponse,
        status: Status.ACTIVE,
        avatar: mockRequest.avatar,
      });
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.OAuth(mockRequest);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'user1@gmail.com',
          role: Role.Customer,
          avatar: 'avatarUrl',
          address: 'Long An',
          phone: '0123456789',
          gender: Gender.MALE,
          displayName: 'Vinh Phuc',
          status: Status.ACTIVE,
        },
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'An error occurred';

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.OAuth(mockRequest)).rejects.toThrow(errorMessage);
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email for a new user and return tokens', async () => {
      const dto: TokenDto = { token: 'confirmToken' };
      const decodedToken = { id: '1' };

      const updatedUserResponse = {
        ...userResponse,
        status: Status.ACTIVE,
        confirmToken: null,
      };

      jest.spyOn(service, 'verifyToken').mockResolvedValueOnce(decodedToken);
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.INACTIVE });
      jest
        .spyOn(prismaService.users, 'update')
        .mockResolvedValueOnce(updatedUserResponse);
      jest.spyOn(service, 'generateTokens').mockResolvedValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const result = await service.confirmEmail(dto);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: updatedUserResponse,
      });
    });

    it('should throw an error if user is already active', async () => {
      const dto: TokenDto = { token: 'confirmToken' };
      const decodedToken = { id: '1' };

      jest.spyOn(service, 'verifyToken').mockResolvedValueOnce(decodedToken);
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      await expect(service.confirmEmail(dto)).rejects.toThrow(
        new HttpException(
          AuthError.USER_ALREADY_ACTIVATED,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if user is blocked', async () => {
      const dto: TokenDto = { token: 'confirmToken' };
      const decodedToken = { id: '1' };

      jest.spyOn(service, 'verifyToken').mockResolvedValueOnce(decodedToken);
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.BLOCKED });

      await expect(service.confirmEmail(dto)).rejects.toThrowError(
        new HttpException(AuthError.USER_BLOCKED, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if confirm token is invalid', async () => {
      const dto: TokenDto = { token: 'invalidToken' };
      const decodedToken = { id: '1' };

      jest.spyOn(service, 'verifyToken').mockResolvedValueOnce(decodedToken);
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.INACTIVE });

      await expect(service.confirmEmail(dto)).rejects.toThrow(
        new HttpException(JwtError.INVALID_TOKEN, HttpStatus.BAD_REQUEST),
      );
    });
  });
});
