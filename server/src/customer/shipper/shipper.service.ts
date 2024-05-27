import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exceptionHandler, ShipperError } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShipperDto } from './dto/shipper.dto';

@Injectable()
export class ShipperService {
  constructor(private prismaService: PrismaService) {}

  async getAllShippers() {
    try {
      const shippers = await this.prismaService.shippers.findMany();
      return shippers;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createShipper(shipperData: ShipperDto) {
    try {
      const { phone, companyName } = shipperData;
      const isExistedShipper = await this.prismaService.shippers.findFirst({
        where: {
          companyName: companyName,
        },
      });

      if (isExistedShipper) {
        throw new HttpException(
          ShipperError.SHIPPER_IS_EXISTED,
          HttpStatus.NOT_FOUND,
        );
      }

      const shippers = await this.prismaService.shippers.create({
        data: {
          phone,
          companyName,
        },
      });

      return { shippers };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updateShipper(id: string, shipperData: ShipperDto) {
    try {
      const { phone, companyName } = shipperData;
      const isExistedShipper = await this.prismaService.shippers.findUnique({
        where: {
          id,
        },
      });

      if (isExistedShipper) {
        throw new HttpException(
          ShipperError.SHIPPER_IS_EXISTED,
          HttpStatus.NOT_FOUND,
        );
      }

      const shipper = await this.prismaService.shippers.update({
        where: {
          id,
        },
        data: {
          phone,
          companyName,
        },
      });

      return { shipper };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deleteShipper(id: string) {
    try {
      const isExistedShipper = await this.prismaService.shippers.findUnique({
        where: {
          id,
        },
      });

      if (isExistedShipper) {
        throw new HttpException(
          ShipperError.SHIPPER_IS_EXISTED,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prismaService.shippers.delete({
        where: {
          id,
        },
      });

      return null;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
