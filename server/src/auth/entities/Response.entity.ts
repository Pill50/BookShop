import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './User.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
