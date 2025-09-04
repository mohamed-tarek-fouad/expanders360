import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  private readonly helmetMiddleware: (req: Request, res: Response, next: NextFunction) => void;

  constructor() {
    this.helmetMiddleware = helmet();
  }

  use(req: Request, res: Response, next: NextFunction): void {

    this.helmetMiddleware(req, res, next);
  }
}
