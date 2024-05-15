import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
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
  app.use(urlencoded({ extended: true, limit: '6mb' }));

  const hbsUtilsInstance = hbsUtils(hbs);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'layouts'),
  );
  hbsUtilsInstance.registerWatchedPartials(
    join(__dirname, '..', 'views', 'partials'),
  );
  app.setViewEngine('hbs');

  await app.listen(8080);
}
bootstrap();
