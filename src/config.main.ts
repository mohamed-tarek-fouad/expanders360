import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nService } from 'nestjs-i18n';

import { ConfigService } from '@config/config.service';

import { ResponseInterceptor } from '@core/interfaces/response.interceptor';


import { initSwagger } from '@swagger';

export function configure(
  app: NestExpressApplication,
  config: ConfigService,
  i18nService: I18nService
): void {
  app.setGlobalPrefix(config.appVirutalPath + '/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Handle unknown property error
        if (errors.length === 1 && errors[0].constraints?.whitelistValidation) {
          return new BadRequestException(i18nService.translate('common.errors.invalidPayload'));
        }

        // Handle other validation errors
        const error = errors[0];
        let message = i18nService.translate('common.errors.validationFailed');
        if (error.constraints && Object.keys(error.constraints).length > 0) {
          message = error.constraints[Object.keys(error.constraints)[0]];
        } else if (error.children && error.children.length > 0) {
          const firstChild = error.children[0];
          if (firstChild.constraints) {
            message = firstChild.constraints[Object.keys(firstChild.constraints)[0]];
          }
        }
        return new BadRequestException(message);
      }
    })
  );

  initSwagger(app, config);
}
