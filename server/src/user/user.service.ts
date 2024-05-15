import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthError } from 'src/common/errors/authError.enum';
import { UserError } from 'src/common/errors/userError.enum';
import { EditProfile } from './types/editProfile.type';
import { exceptionHandler } from 'src/common/errors';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private cloudinarService: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatar: true,
          address: true,
          phone: true,
          gender: true,
          role: true,
          status: true,
          loginFrom: true,
        },
      });
      if (!user) {
        throw new HttpException(
          AuthError.USER_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async editProfile(
    avatar: Express.Multer.File,
    userId: string,
    body: EditProfile,
  ) {
    try {
      let url;
      const user = await this.prismaService.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new HttpException(AuthError.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      if (avatar) {
        if (avatar.size > parseInt(process.env.MAX_FILE_SIZE)) {
          throw new HttpException(
            UserError.FILE_TOO_LARGE,
            HttpStatus.BAD_REQUEST,
          );
        } else if (avatar.size > 0) {
          const image = await this.cloudinarService.uploadFile(avatar);
          url = image.secure_url;
        }
      } else url = user.avatar;

      if (!body.displayName) {
        throw new HttpException(
          UserError.DISPLAY_NAME_CANNOT_BE_EMPTY,
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedUser = await this.prismaService.users.update({
        where: {
          id: userId,
        },
        data: {
          avatar: url,
          displayName: body.displayName,
          address: body.address,
          phone: body.phone,
          gender: body.gender,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserOrders(userId: string, pageIndex: number, status: string) {
    try {
      let baseFilter: any = {
        userId,
      };

      if (status) {
        baseFilter.status = status;
      }

      const totalRecord = await this.prismaService.orders.count({
        where: baseFilter,
      });

      const take = 10;
      const skip = ((pageIndex ?? 1) - 1) * take;
      const totalPage = Math.ceil(totalRecord / take);

      const order = await this.prismaService.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          orders: {
            skip: skip,
            take: take,
            select: {
              id: true,
              note: true,
              status: true,
              amount: true,
              recieverName: true,
              recieverPhone: true,
              address: true,
              totalPrice: true,
              createdAt: true,
              orderDetail: {
                select: {
                  id: true,
                  amount: true,
                  price: true,
                  totalPrice: true,
                  orderDate: true,
                  discount: true,
                  book: true,
                },
              },
              shipper: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new HttpException(
          AuthError.USER_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        totalPage,
        totalRecord,
        order,
      };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
