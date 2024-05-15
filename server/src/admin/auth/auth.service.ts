import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email: email, role: 'ADMIN' },
    });
    return user;
  }
}
