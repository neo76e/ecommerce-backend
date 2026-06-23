import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env.validation';
import { allConfigs } from './configuration';

const envFile =
  process.env.NODE_ENV === 'production'
    ? ['.env.prod', '.env']
    : ['.env.dev', '.env'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      envFilePath: envFile,
      load: allConfigs,
    }),
  ],
})
export class AppConfigModule {}
