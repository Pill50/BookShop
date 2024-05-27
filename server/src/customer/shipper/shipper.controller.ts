import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResTransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ShipperService } from './shipper.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ResponseMessage, Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Role } from '@prisma/client';
import { ShipperDto } from './dto/shipper.dto';

@Controller('shipper')
@UseInterceptors(ResTransformInterceptor)
export class ShipperController {
  constructor(private shipperService: ShipperService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Retrieved shippers successfully')
  async getAllShippers() {
    return await this.shipperService.getAllShippers();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Create shipper successfully')
  async createShipper(@Body() shipperData: ShipperDto) {
    return await this.shipperService.createShipper(shipperData);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Update shipper information successfully')
  async updateShipperInfo(
    @Param('id') id: string,
    @Body() shipperData: ShipperDto,
  ) {
    return await this.shipperService.updateShipper(id, shipperData);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Delete shipper successfully')
  async deleteShipper(@Param('id') id: string) {
    return await this.shipperService.deleteShipper(id);
  }
}
