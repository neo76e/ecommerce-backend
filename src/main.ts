import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { setupApp } from './bootstrap/setup-app';
import { NestExpressApplication } from '@nestjs/platform-express';
import { APP_CONFIG } from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  setupApp(app, logger, config);

  const appCfg = config.getOrThrow<{ port: number }>(APP_CONFIG);
  const port = appCfg.port;
  await app.listen(port ?? 8080);
  logger.log(`Application is running on port: ${port}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start app: ', error);
  process.exit(1);
});
