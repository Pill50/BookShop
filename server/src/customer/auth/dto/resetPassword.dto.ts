import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsString({ message: 'Password must be a string' })
  token: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @Field()
  @IsString({ message: 'Confirm password must be a string' })
  @Length(8, 20, {
    message: 'Confirm password must be between 8 and 20 characters',
  })
  confirmPassword: string;
}
