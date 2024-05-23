import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @IsNotEmpty({ message: 'Price must not be empty' })
  price: number;

  @IsOptional()
  discount: number;

  @IsOptional()
  amount: number;

  @IsNotEmpty({ message: 'Author ID must not be empty' })
  authorId: string;

  @IsNotEmpty({ message: 'Publisher ID must not be empty' })
  publisherId: string;

  @IsNotEmpty({ message: 'Category must not be empty' })
  categories: string[];
}
