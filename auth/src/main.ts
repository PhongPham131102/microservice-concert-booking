import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
const logger = new Logger('Application');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'verbose', 'warn'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useBodyParser('json', { limit: '80mb' });
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 5536;
  await app.listen(port);
  logger.verbose('System running on port ' + port);
}
bootstrap();
