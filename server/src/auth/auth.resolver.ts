import { AuthService } from './auth.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/User.entity';
import { LoginDto } from './dto/login.dto';
import { Payload } from './types';
import { GetCurrentUser } from 'src/common/decorators';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => User)
  async getMe(@GetCurrentUser() user: Payload) {
    return user;
  }

  @Mutation(() => User)
  login(@Args('loginInput') loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }
}
