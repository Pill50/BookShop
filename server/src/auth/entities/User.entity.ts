import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  authId?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  isLogin: boolean;

  @Field({ nullable: true })
  loginFrom?: string;

  @Field()
  status: number;

  @Field()
  attempts: number;

  @Field()
  role: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  confirmToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  resetToken?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
