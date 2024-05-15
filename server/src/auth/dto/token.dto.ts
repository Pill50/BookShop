import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class TokenDto {
  @Field()
  @IsNotEmpty({ message: 'User token cannot be empty' })
  @IsString({ message: 'User token must be a string' })
  token: string;
}
