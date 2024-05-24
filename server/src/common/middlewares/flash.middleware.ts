import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class FlashMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    res.locals.success_msg = req.session?.success_msg;
    res.locals.error_msg = req.session?.error_msg;
    res.locals.user = req.session?.user || null;
    next();
  }
}
