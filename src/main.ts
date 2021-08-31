import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { ResponseErrorFilter } from "./shared/filters/response-error.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new ResponseErrorFilter())

  const config = new DocumentBuilder()
    .setTitle('Auth Project')
    .setDescription('Authentication & Authorization Restful API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
