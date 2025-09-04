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
export class ForwardedIpMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService,
    private configService: ConfigService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const allowedForwardedIps = this.configService.security.request.allowedForwardedIps;
      const header = req.headers['x-forwarded-for'];

      if (allowedForwardedIps.length === 0 || !header) {
        return next();
      }

      const forwardedIps = header.toString().split(',').map(ip => ip.trim());
      const allowed = forwardedIps.some(ip => allowedForwardedIps.includes(ip));

      if (!allowed) {
        throw new HttpException(
          this.i18n.translate('errors.unrecognizedXForwardedForHeader'),
          HttpStatus.BAD_REQUEST
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}