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
export class HostValidationMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService,
    private configService: ConfigService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const allowedHosts: string[] = this.configService.allowedHosts;

      const host = req.headers.host;

      if (!host || !allowedHosts.includes(host)) {
        throw new HttpException(
          this.i18n.translate('common.errors.headers.unrecognizedHostHeader'),
          HttpStatus.BAD_REQUEST
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
