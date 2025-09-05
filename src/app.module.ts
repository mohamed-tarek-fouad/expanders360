import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ConfigModule } from '@config/config.module';
import { ConfigModuleConfig } from '@config/options/config.config';

import { CoreModule } from '@core/core.module';
import { I18nConfigModule } from '@features/i18n/i18n.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { ResearchModule } from './features/research/research.module';
import { ProjectsModule } from './features/projects/projects.module';
import { VendorsModule } from './features/vendors/vendors.module';
import { MongoDBModule } from './database/mongodb.service';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    DatabaseModule,
    MongoDBModule,
    I18nConfigModule,
    CoreModule,
    AuthModule,
    ResearchModule,
    ProjectsModule,
    VendorsModule
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
