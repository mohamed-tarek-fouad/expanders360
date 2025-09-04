import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { I18nService } from 'nestjs-i18n';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { ConfigService } from '@config/config.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private rateLimiter: RateLimiterMemory;
  private points: number;
  constructor(
    @Inject(I18nService) private readonly i18n: I18nService,
    private configService: ConfigService
  ) {
    if (!this.configService.rateLimiter.enabled) {
      return;
    }

    this.points = configService.rateLimiter.default.points;
    this.rateLimiter = new RateLimiterMemory({
      points: this.points,
      duration: configService.rateLimiter.default.duration,
      blockDuration: configService.rateLimiter.default.blockDuration
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.configService.rateLimiter.enabled) {
      return next();
    }

    const key = req.ip as string;

    try {
      await this.rateLimiter.consume(key);
      next();
    } catch (rateLimiterResponse) {
      res.setHeader(
        'Retry-After',
        Math.ceil(rateLimiterResponse.msBeforeNext / 1000)
      );
      res.setHeader('X-RateLimit-Limit', this.points);
      res.setHeader(
        'X-RateLimit-Remaining',
        String(rateLimiterResponse.remainingPoints)
      );
      res.setHeader(
        'X-RateLimit-Reset',
        Math.floor(
          DateTime.now()
            .plus({ milliseconds: rateLimiterResponse.msBeforeNext })
            .toSeconds()
        )
      );
      next(
        new HttpException(
          this.i18n.translate('common.errors.toManyRequests'),
          HttpStatus.TOO_MANY_REQUESTS
        )
      );
    }
  }
}
