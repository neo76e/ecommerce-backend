import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PinoLoggerModule } from './config/logger/logger.module';
import { AppThrottlerModule } from './config/throttler/throttler.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CorrelationIdMiddleware } from './core/middlewares/correlation-id.middleware';
import { AllExceptionFilter } from './core/filters/all-exceptions.filter';
import { AppConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database/typeorm-config.service';

@Module({
  imports: [
    AppConfigModule,
    PinoLoggerModule,
    AppThrottlerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
