import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { urlencoded } from 'express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { isCategorySelected } from './utils/helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory(errors) {
        const error = errors
          .map((error) => {
            return Object.values(error.constraints);
          })
          .join(', ');
        const message = `Validation failed`;
        return new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message,
            error,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  app.use(bodyParser.json());
  app.use(urlencoded({ extended: true }));

  const hbsUtilsInstance = hbsUtils(hbs);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('isCategorySelected', isCategorySelected);
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'layouts'),
  );
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'partials'),
  );
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: 'nest-book',
      resave: true,
      saveUninitialized: false,
    }),
  );
  app.use('/admin', function (req, res, next) {
    res.locals.session = req.session;
    res.locals.user = req.session.user || null;
    const flashErrors: string[] = req.session.flashErrors;
    if (flashErrors) {
      res.locals.flashErrors = flashErrors;
      req.session.flashErrors = null;
    }
    next();
  });

  app.use('/admin', function (req: any, res, next) {
    // if (
    //   !req.session.user &&
    //   !req.url.startsWith('/auth') &&
    //   req.session.user?.role !== 'ADMIN'
    // ) {
    //   return res.redirect('/admin/auth/login');
    // }
    next();
  });

  await app.listen(8080);
}
bootstrap();
