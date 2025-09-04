import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import { ConfigService } from '@config/config.service';

@Injectable()
export class MaxPayloadSizeKbMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService,
    private appConfig: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const maxPayloadSize = this.appConfig.maxPayloadSize;
      const maxKb = parseInt(maxPayloadSize.replace('kb', ''), 10);
      const maxBytes = maxKb * 1024;
      const contentLength = req.headers['content-length'];

      if (contentLength && parseInt(contentLength, 10) > maxBytes) {
        const errorMessage = this.i18n.translate(
          'common.errors.payloadTooLarge',
          {
            args: { maxSize: maxKb }
          }
        );

        throw new HttpException(errorMessage, HttpStatus.PAYLOAD_TOO_LARGE);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}