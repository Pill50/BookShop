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
}
