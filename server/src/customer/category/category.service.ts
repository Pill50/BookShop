import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryError, exceptionHandler } from 'src/common/errors';
import { CategoryDto } from './dto/category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAllCategories() {
    try {
      const categories = await this.prismaService.categories.findMany();
      return categories;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
