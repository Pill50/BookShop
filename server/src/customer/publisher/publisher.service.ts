import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublisherService {
  constructor(private prismaService: PrismaService) {}

  async getAllPublishers() {
    try {
      const publishers = await this.prismaService.publishers.findMany();
      return publishers;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
