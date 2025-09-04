import { Injectable, NestMiddleware } from '@nestjs/common';

import * as cors from 'cors';
import { NextFunction, Request, Response } from 'express';

import { ConfigService } from '@config/config.service';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly corsMiddleware;

  constructor(private configService: ConfigService) {
    this.corsMiddleware = cors({
      origin: this.configService.cors.whitelist,
      methods: this.configService.cors.methods
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.corsMiddleware(req, res, next);
  }
}