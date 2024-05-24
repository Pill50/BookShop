import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: any) => {
    if (context.contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      if (request && request.user) {
        if (data) {
          return request.user[data];
        }
        return request.user;
      }
    } else {
      const request = context.switchToHttp().getRequest();
      if (request && request.user) {
        if (data) {
          return request.user[data];
        }
        return request.user;
      }
    }
    return null;
  },
);
