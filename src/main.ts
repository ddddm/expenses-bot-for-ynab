import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { getProjectMeta } from './project-meta';

const PORT = 3000;

async function bootstrap() {
  const { description, version }  = await getProjectMeta();
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Expense tracker for YNAB')
    .setDescription(description)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  Logger.log(`App started on port ${PORT}`);
}

// process.on('unhandledRejection')

bootstrap();
