import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { UAParser } from 'ua-parser-js';

import { REQUEST_HEADER } from '@core/constants/http-constants';
import { RequestHeadersDto } from '@core/validation/request-header.validation';

@Injectable()
export class RequestHeadersValidatorMiddleware implements NestMiddleware {
  constructor(@Inject(I18nService) private readonly i18n: I18nService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const headersDto = plainToClass(RequestHeadersDto, req.headers);
      const errors = await validate(headersDto);
      if (errors.length > 0) {
 
        const error = errors[0];
        const constraintKey = error.constraints ? Object.values(error.constraints)[0] : 'Invalid request headers';
        throw new HttpException(
          this.i18n.translate(String(constraintKey)),
          HttpStatus.BAD_REQUEST
        );
      }

      const userAgent = new UAParser(req.header(REQUEST_HEADER.USER_AGENT));

      const reqAdditionalProps = {
        id: req.header(REQUEST_HEADER.X_REQUEST_ID),
        userAgent: {
          name: userAgent.getBrowser().name,
          version: userAgent.getBrowser().version,
          device: {
            name: userAgent.getDevice().model
          },
          os: {
            name: userAgent.getOS().name,
            version: userAgent.getOS().version
          }
        },
        client: {
          name: req.header(REQUEST_HEADER.X_CLIENT_NAME),
          version: req.header(REQUEST_HEADER.X_CLIENT_VERSION),
          buildNumber: req.header(REQUEST_HEADER.X_CLIENT_BUILD_NUMBER),
          environment: req.header(REQUEST_HEADER.X_CLIENT_ENVIRONMENT)
        },
        device: {
          id: req.header(REQUEST_HEADER.X_DEVICE_ID),
          manufacturer: req.header(REQUEST_HEADER.X_DEVICE_MANUFACTURER),
          model: {
            identifier: req.header(REQUEST_HEADER.X_DEVICE_MODEL_IDENTIFIER),
            name: req.header(REQUEST_HEADER.X_DEVICE_MODEL_NAME)
          }
        },
        geolocation: {
          lat: req.header(REQUEST_HEADER.X_GEO_LATITUDE),
          lon: req.header(REQUEST_HEADER.X_GEO_LONGITUDE)
        }
      };

      Object.assign(req, reqAdditionalProps);
      next();
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'common.errors.internalServerError'
        }, HttpStatus.INTERNAL_SERVER_ERROR));
      }
    }
  }
}
