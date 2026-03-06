import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // Strips away fields that aren't in the DTO
    forbidNonWhitelisted: true, // Throws an error if extra fields are sent
    transform: true,      // Automatically transforms payloads to DTO instances
  }));

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Users and Tasks API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();