import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AppModule } from 'src/app.module';
import { Gender, OrderStatus, Role } from '@prisma/client';
import { Status } from '../auth/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthError, UserError } from 'src/common/errors';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let mockResponse = {
    address: 'Long An',
    avatar:
      'https://res.cloudinary.com/dnexchfxr/image/upload/v1713840788/samples/man-on-a-escalator.jpg',
    displayName: 'Vinh Phuc',
    email: 'user1@gmail.com',
    gender: Gender.MALE,
    id: '1',
    loginFrom: '',
    phone: '0123456789',
    role: Role.CUSTOMER,
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
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn(),
            editProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const userId = '1';

      jest.spyOn(userService, 'getProfile').mockResolvedValue(mockResponse);

      const result = await controller.getProfile(userId);
      expect(result).toEqual(mockResponse);
      expect(userService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should return a status of 400', async () => {
      const userId = '-1';
      try {
        await controller.getProfile(userId);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return a status of 500', async () => {
      const userId = undefined;
      try {
        await controller.getProfile(userId);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('editProfile', () => {
    it('should return the updated user profile', async () => {
      const userId = '1';
      const mockAvatar = {
        originalname: 'a.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
        size: 1024,
      } as unknown as Express.Multer.File;

      const body = {
        displayName: 'Vinh Phuc Tran',
        phone: '012345678',
        address: 'TPHCM',
        gender: null,
      };

      jest.spyOn(userService, 'editProfile').mockResolvedValue(mockResponse);

      const result = await controller.editProfile(mockAvatar, userId, body);
      expect(result).toEqual(mockResponse);
      expect(userService.editProfile).toHaveBeenCalledWith(
        mockAvatar,
        userId,
        body,
      );
    });

    it('should throw an error for file size exceeding limit', async () => {
      const userId = '1';
      const mockAvatar = {
        originalname: 'a.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
        size: parseInt(process.env.MAX_FILE_SIZE) + 1,
      } as Express.Multer.File;

      const body = {
        displayName: 'Vinh Phuc Tran',
        phone: '012345678',
        address: 'TPHCM',
        gender: null,
      };

      try {
        await controller.editProfile(mockAvatar, userId, body);
        fail('An error should be thrown');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toContain(UserError.FILE_TOO_LARGE);
      }
    });

    it('should throw an error for missing display name', async () => {
      const userId = '1';
      const mockAvatar = {
        originalname: 'a.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
        size: parseInt(process.env.MAX_FILE_SIZE) - 1,
      } as unknown as Express.Multer.File;

      const body = {
        phone: '012345678',
        address: 'TPHCM',
        gender: null,
        displayName: null,
      };

      try {
        await controller.editProfile(mockAvatar, userId, body);
        fail('An error should be thrown');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toContain(UserError.DISPLAY_NAME_CANNOT_BE_EMPTY);
      }
    });

    it('should throw an error for non-existent user', async () => {
      const userId = '-1';
      const mockAvatar = {
        originalname: 'a.png',
        mimetype: 'image/png',
        buffer: Buffer.from(''),
        size: 1024,
      } as unknown as Express.Multer.File;

      const body = {
        displayName: 'Vinh Phuc Tran',
        phone: '012345678',
        address: 'TPHCM',
        gender: null,
      };

      jest
        .spyOn(userService, 'editProfile')
        .mockRejectedValue(
          new HttpException(AuthError.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
        );

      try {
        await controller.editProfile(mockAvatar, userId, body);
        fail('An error should be thrown');
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toContain(AuthError.USER_NOT_FOUND);
      }
    });
  });
});
