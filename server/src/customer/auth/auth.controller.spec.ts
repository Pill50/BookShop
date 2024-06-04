import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { Role, Status } from './types';
import { Gender } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { AuthError } from 'src/common/errors';

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
    accessToken: '',
    refreshToken: '',
    resetToken: '',
    confirmToken: '',
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
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test User',
      };

      const confirmToken = 'confirmationToken';

      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValueOnce(userResponse);
      jest
        .spyOn(service, 'generateUserIdToken')
        .mockResolvedValueOnce(confirmToken);
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(undefined);

      const result = await service.register(registerDto);

      expect(result).toEqual(true);
      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: {
          email: registerDto.email,
        },
      });
      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: expect.any(String),
          displayName: registerDto.displayName,
          isLogin: false,
          status: Status.INACTIVE,
          role: Role.Customer,
        },
      });
      expect(service.generateUserIdToken).toHaveBeenCalledWith(userResponse.id);
      expect(mailerService.sendMail).toHaveBeenCalled();
    });

    it('should throw an error if password and confirmPassword do not match', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
        displayName: 'Test User',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        new HttpException(
          'Password do not match confirm password',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if the user already exists and is active', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test User',
      };

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      await expect(service.register(registerDto)).rejects.toThrow(
        new HttpException(
          'User is already activate login',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if the user already exists and is inactive', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test User',
      };

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);

      await expect(service.register(registerDto)).rejects.toThrow(
        new HttpException(
          'User is already activate login',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const email = 'user1@gmail.com';
      const password = 'password123';

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

      const result = await service.login({ email, password });

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          email,
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
      const email = 'user2@gmail.com';
      const password = 'password1234';

      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.login({ email, password })).rejects.toThrow(
        AuthError.USER_INVALID_CREDENTIALS,
      );
    });

    it('should throw an error if user is not activated', async () => {
      const email = 'test@gmail.com';
      const password = 'password123';

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.INACTIVE });

      await expect(service.login({ email, password })).rejects.toThrow(
        AuthError.USER_NOT_ACTIVATED,
      );
    });

    it('should throw an error if user is blocked', async () => {
      const email = 'user1@gmail.com';
      const password = 'password123';

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, status: Status.BLOCKED });

      await expect(service.login({ email, password })).rejects.toThrow(
        AuthError.USER_BLOCKED,
      );
    });

    it('should throw an error if user is using OAuth login', async () => {
      const email = 'user1@gmail.com';
      const password = 'password123';

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce({ ...userResponse, authId: 'authId' });

      await expect(service.login({ email, password })).rejects.toThrow(
        AuthError.USER_OAUTH_LOGIN,
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const email = 'user1@gmail.com';
      const password = 'wrongPassword';

      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValueOnce(userResponse);
      jest.spyOn(service, 'verifyHash').mockResolvedValueOnce(false);

      await expect(service.login({ email, password })).rejects.toThrow(
        AuthError.USER_INVALID_CREDENTIALS,
      );
    });
  });
});
