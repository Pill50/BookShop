import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;
}
