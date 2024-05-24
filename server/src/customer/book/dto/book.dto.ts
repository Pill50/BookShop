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

  @IsNotEmpty({ message: 'Author must not be empty' })
  authorName: string;

  @IsNotEmpty({ message: 'Publisher must not be empty' })
  publisherName: string;

  @IsNotEmpty({ message: 'Category must not be empty' })
  categories: string[];
}
