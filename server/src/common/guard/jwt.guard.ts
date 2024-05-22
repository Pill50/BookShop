import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthError } from '../errors/authError.enum';
import { Payload } from '../../auth/types/payload.type';
import { JwtError } from 'src/common/errors/jwtError.enum';
import { Status } from '../../auth/types/status.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isGraphQLContext =
      !!GqlExecutionContext.create(context).getContext().req;

    let request;
    if (isGraphQLContext) {
      request = GqlExecutionContext.create(context).getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        publicKey: process.env.PUBLIC_KEY,
      });

      const user = await this.prisma.users.findUnique({
        where: { id: payload.id },
        select: {
          status: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException(JwtError.INVALID_TOKEN);
      }
      if (user.status === Status.INACTIVE) {
        throw new UnauthorizedException(AuthError.USER_NOT_ACTIVATED);
      }
      if (user.status === Status.BLOCKED) {
        throw new UnauthorizedException(AuthError.USER_BLOCKED);
      }

      request.user = payload;

      return true;
    } catch (error) {
      if (error.name === JwtError.TOKEN_EXPIRED_ERROR) {
        throw new UnauthorizedException(JwtError.ACCESS_TOKEN_EXPIRED);
      }
      if (
        error.name === JwtError.JSON_WEB_TOKEN_ERROR ||
        error.name === JwtError.SYNTAX_ERROR
      ) {
        throw new UnauthorizedException(JwtError.INVALID_TOKEN);
      }
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const {
      headers: { authorization },
    } = request;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }
    return null;
  }
}
