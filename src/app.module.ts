import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@config/config.module';
import { ConfigModuleConfig } from '@config/options/config.config';

import { CoreModule } from '@core/core.module';
import { I18nConfigModule } from '@features/i18n/i18n.module';

import { CompressionMiddleware } from '@middlewares/performance';
import {
  CorsMiddleware,
  ForwardedIpMiddleware,
  HelmetMiddleware,
  HostValidationMiddleware,
  MaxPayloadSizeKbMiddleware,
  RateLimiterMiddleware,
  RequestTimeOffsetMiddleware
} from '@middlewares/security';
import {
  RequestHeadersValidatorMiddleware,
  RequestIdMiddleware
} from '@middlewares/trackers';

@Module({
  imports: [
    ConfigModule.forRootAsync({ useClass: ConfigModuleConfig }),
    I18nConfigModule,
    CoreModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorsMiddleware,
        HostValidationMiddleware,
        ForwardedIpMiddleware,
        CompressionMiddleware,
        HelmetMiddleware,
        RequestHeadersValidatorMiddleware,
        RequestIdMiddleware,
        RequestTimeOffsetMiddleware,
        MaxPayloadSizeKbMiddleware,
        RateLimiterMiddleware
            )
      .forRoutes('*path');
  }
}
