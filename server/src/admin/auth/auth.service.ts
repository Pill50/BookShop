import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthError } from 'src/common/errors';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async createOrUpdate(email: string, password: string, confirmPassword) {
    const passwordHash = await argon2.hash(password);
    const user = await this.prismaService.users.create({
      data: {
        email: email,
        password: passwordHash,
        displayName: 'admin',
        role: 'ADMIN',
        isLogin: true,
        status: 1,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email: email },
    });
    if (user) {
      const isMatch = await argon2.verify(user.password, password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
}
