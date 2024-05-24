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
import {
  isCategorySelected,
  getStatusColorClass,
  formatDate,
  eq,
  gte,
  getTypePromotion,
} from './utils/helper';

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
  hbs.registerPartials(join(__dirname, '..', 'views', 'dashboard'));
  hbs.registerHelper('isCategorySelected', isCategorySelected);
  hbs.registerHelper('getStatusColorClass', getStatusColorClass);
  hbs.registerHelper('getTypePromotion', getTypePromotion);
  hbs.registerHelper('formatDate', formatDate);
  hbs.registerHelper('eq', eq);
  hbs.registerHelper('gte', gte);

  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'layouts'),
  );
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'partials'),
  );
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'dashboard'),
  );
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: 'nest-book',
      resave: true,
      saveUninitialized: false,
    }),
  );

  await app.listen(8080);
}
bootstrap();
