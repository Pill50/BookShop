import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@InputType()
export class OAuthDto {
  @Field()
  @IsNotEmpty({ message: 'OAuth ID cannot be empty' })
  @IsString({ message: 'OAuth ID must be a string' })
  authId: string;

  @Field()
  @IsString({ message: 'OAuth avatar must be a string' })
  avatar: string;

  @Field()
  @IsString({ message: 'OAuth display name must be a string' })
  displayName: string;

  @Field()
  @IsNotEmpty({ message: 'OAuth email cannot be empty' })
  @IsEmail({}, { message: 'OAuth email must be a valid email' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'OAuth provider cannot be empty' })
  loginFrom: string;
}
