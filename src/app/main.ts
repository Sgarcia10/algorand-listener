import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '../domain/logger/logger.service';

async function bootstrap() {
  const logger: Logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger
  });
  app.useLogger(logger);
  await app.init();
}
bootstrap();
