import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditProfile } from './types/editProfile.type';
import { FilterUserOrder } from './types/filterUserOrder.type';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guard/role.guard';
import { OrderStatus } from '@prisma/client';

@Controller('user')
@UseInterceptors(ResTransformInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Profile retrieved successfully')
  async getProfile(@GetCurrentUser('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Post('/edit-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Edit profile successfully')
  @UseInterceptors(FileInterceptor('avatar'))
  async editProfile(
    @UploadedFile() avatar: Express.Multer.File,
    @GetCurrentUser('id') userId: string,
    @Body() body: EditProfile,
  ) {
    return this.userService.editProfile(avatar, userId, body);
  }

  @Get('/my-orders')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Get all user orders successfully')
  async getUserOrders(
    @GetCurrentUser('id') userId: string,
    @Query() filter: FilterUserOrder,
  ) {
    const pageIndex: number | undefined = filter.page
      ? parseInt(filter.page as string, 10)
      : undefined;

    const status: OrderStatus | undefined = filter.status
      ? (filter.status as OrderStatus)
      : undefined;

    return await this.userService.getUserOrders(userId, pageIndex, status);
  }
}
