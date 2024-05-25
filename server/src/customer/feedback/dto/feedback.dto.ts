import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
  @IsString({ message: 'UserId must be a string' })
  @IsNotEmpty({ message: 'UserId must not be empty' })
  userId: string;

  @IsString({ message: 'BookId must be a string' })
  @IsNotEmpty({ message: 'BookId must not be empty' })
  bookId: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content must not be empty' })
  content: string;
}
