import { Injectable, NestMiddleware } from '@nestjs/common';
import * as compression from 'compression';
import { NextFunction, Request, RequestHandler, Response } from 'express';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  private readonly compressionMiddleware: RequestHandler;

  constructor() {
    this.compressionMiddleware = compression();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.compressionMiddleware(req, res, next);
  }
}
