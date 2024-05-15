import { ObjectType, Field } from '@nestjs/graphql';
import { Tokens } from './Token.entity';
import { User } from './User.entity';

@ObjectType()
export class ConfirmEmailResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LoginResponse {
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
