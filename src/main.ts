import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets("public")
  const { PORT } = process.env;
  initSwagger(app);
  app.use(cookieParser(process.env.COOKIE_SECRET))
  await app.listen(PORT, () => {
    console.log(`server > http://localhost:${PORT}`);
    console.log(`swagger > http://localhost:${PORT}/swagger`);

  });
}
bootstrap();
