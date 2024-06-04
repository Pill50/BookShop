import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
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
}
