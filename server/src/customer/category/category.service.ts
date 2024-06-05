import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategories() {
    try {
      const categories = await this.prismaService.categories.findMany();
      return categories;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
