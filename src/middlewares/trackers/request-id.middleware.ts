import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(@Inject(I18nService) private readonly i18n: I18nService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = req.headers['x-request-id'] as string;

      req['requestId'] = requestId;
      res.setHeader('X-Request-ID', requestId);
      next();
    } catch (error) {
      next(error);
    }
  }
}
