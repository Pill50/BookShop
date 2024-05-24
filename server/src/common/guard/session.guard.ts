import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from './../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { session } = request;

    if (!session) {
      request.session.error_msg = 'No session found';
      response.redirect('/admin/auth/login');
      return false;
    }

    if (!session.user) {
      request.session.error_msg = 'No user logged in';
      response.redirect('/admin/auth/login');
      return false;
    }

    const user = session.user;
    const foundUser = await this.prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!foundUser) {
      request.session.error_msg = 'User not found';
      response.redirect('/admin/auth/login');
      return false;
    }

    if (
      requiredRoles &&
      !requiredRoles.some((role) => foundUser.role === role)
    ) {
      request.session.error_msg = 'User does not have the required role';
      response.redirect('/admin/auth/login');
      return false;
    }

    request.user = foundUser;

    return true;
  }
}
