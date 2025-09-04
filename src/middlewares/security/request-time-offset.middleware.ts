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
export class RequestTimeOffsetMiddleware implements NestMiddleware {

  constructor(
    @Inject(I18nService) private readonly i18n: I18nService,
    private configService: ConfigService
  ) {}


  use(req: Request, res: Response, next: NextFunction) {

    const maxOffsetSeconds = this.configService.maxTimeOffsetInSeconds;

    try {
      const requestTimeHeader = req.headers['x-request-time'] as string;

 

      const requestTimeMillis = Date.parse(requestTimeHeader);
      if (isNaN(requestTimeMillis)) {
        throw new HttpException(
          this.i18n.translate('common.errors.headers.xRequestTimeHeaderInvalid'),
          HttpStatus.BAD_REQUEST
        );
      }

      const requestTimeSeconds = Math.floor(requestTimeMillis / 1000);
      const currentTimeSeconds = Math.floor(Date.now() / 1000);
      const timeDifferenceSeconds = Math.abs(
        currentTimeSeconds - requestTimeSeconds
      );

      if (timeDifferenceSeconds > maxOffsetSeconds) {
        throw new HttpException(
          this.i18n.translate('common.errors.headers.xRequestTimeHeaderInvalid'),
          HttpStatus.BAD_REQUEST
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
