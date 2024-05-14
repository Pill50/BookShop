import { AuthService } from './auth.service';
import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/User.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => User)
  async getMe() {
    return this.authService.getMe();
  }
}
