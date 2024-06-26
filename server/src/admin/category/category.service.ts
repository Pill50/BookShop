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

  async getAllCategories(pageIndex: number = 1) {
    try {
      const take = 10;
      const skip = (pageIndex - 1) * take;

      const [categories, totalRecord] = await Promise.all([
        this.prismaService.categories.findMany({
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prismaService.categories.count(),
      ]);

      const totalPage = Math.ceil(totalRecord / take);

      return {
        categories,
        totalPage,
        totalRecord,
      };
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
      const isExistedCategory = await this.prismaService.categories.findFirst({
        where: { id },
      });

      if (!isExistedCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      let url = process.env.DEFAULT_CATEGORY_IMAGE;
      if (
        thumbnail &&
        thumbnail.size > 0 &&
        thumbnail.size <= parseInt(process.env.MAX_FILE_SIZE)
      ) {
        const thumbnail_upload =
          await this.cloudinaryService.uploadFile(thumbnail);
        url = thumbnail_upload.secure_url;
      }

      const updatedCategory = await this.prismaService.categories.update({
        where: { id },
        data: {
          title,
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
