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

  async getCategoryById(id: string) {
    try {
      const category = await this.prismaService.categories.findUnique({
        where: {
          id: id,
        },
      });
      return category;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async createCategory(title: string) {
    try {
      const isExistedCategory = await this.prismaService.categories.findFirst({
        where: {
          title: title,
        },
      });

      if (isExistedCategory) {
        throw new HttpException(
          CategoryError.CATEGORY_IS_EXISTED,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newCategory = await this.prismaService.categories.create({
        data: {
          title: title,
          thumbnail: process.env.DEFAULT_CATEGORY_IMAGE,
        },
      });

      return newCategory;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async updateCategory(
    id: string,
    title: string,
    thumbnail: Express.Multer.File,
  ) {
    try {
      let url = '';
      const isExistedCategory = await this.prismaService.categories.findFirst({
        where: {
          id,
        },
      });

      if (thumbnail) {
        if (thumbnail.size > parseInt(process.env.MAX_FILE_SIZE)) {
          throw new HttpException(
            CategoryError.FILE_TOO_LARGE,
            HttpStatus.BAD_REQUEST,
          );
        } else if (thumbnail.size > 0) {
          const thumbnail_upload =
            await this.cloudinaryService.uploadFile(thumbnail);
          url = thumbnail_upload.secure_url;
        } else {
          url = process.env.DEFAULT_CATEGORY_IMAGE;
        }
      } else if (isExistedCategory && isExistedCategory.thumbnail) {
        url = isExistedCategory.thumbnail;
      } else url = process.env.DEFAULT_CATEGORY_IMAGE;

      const updatedCategory = await this.prismaService.categories.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          thumbnail: url,
        },
      });

      return updatedCategory;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      const isExistedCategory = await this.prismaService.categories.findFirst({
        where: {
          id: id,
        },
      });

      if (!isExistedCategory) {
        throw new HttpException(
          CategoryError.CATEGORY_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.categories.delete({
        where: {
          id: id,
        },
      });

      return null;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  async uploadThumbnail(thumbnail: Express.Multer.File, id: string) {
    try {
      const category = await this.prismaService.categories.findUnique({
        where: { id },
        select: {
          thumbnail: true,
        },
      });

      if (thumbnail.size > parseInt(process.env.MAX_FILE_SIZE)) {
        throw new HttpException(
          CategoryError.FILE_TOO_LARGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (category.thumbnail !== process.env.DEFAULT_CATEGORY_IMAGE) {
        await this.cloudinaryService.deleteFile(category.thumbnail);
      }

      if (thumbnail === undefined) {
        return await this.prismaService.categories.update({
          where: { id },
          data: {
            thumbnail: process.env.DEFAULT_CATEGORY_IMAGE,
          },
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        });
      }

      const { secure_url } = await this.cloudinaryService.uploadFile(thumbnail);
      return await this.prismaService.categories.update({
        where: { id },
        data: {
          thumbnail: secure_url,
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      });
    } catch (error) {
      return exceptionHandler(error);
    }
  }
}
