import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';


import { ConfigService } from '@config/config.service';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService
  ) {}

  private tryTranslate(message: string): string {
    try {
      return this.i18nService.translate(message);
    } catch {
      return message;
    }
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else {
        message = (errorResponse as any).message || exception.message;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        exception instanceof Error
          ? exception.message
          : 'common.errors.internalServerError';
    }


    if (this.configService.isProd) {
      message = 'common.errors.badRequest';
    }
    // Get the first error message and translate it
    if (typeof message === 'string') {
      message = this.tryTranslate(message);
    } else {
      message = 'common.errors.internalServerError';
    }

    const errorResponse = {
      error: {
        message
      }
    };
    if (!this.configService.isProd && exception instanceof Error) {
      errorResponse.error['stack'] = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
