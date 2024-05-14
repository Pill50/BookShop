import { IsEmail, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
