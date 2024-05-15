import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RefreshTokensDto {
  @Field()
  @IsString({ message: 'Refresh Token must be a string' })
  refreshToken: string;
}
