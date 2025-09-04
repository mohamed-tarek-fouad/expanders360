import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsIn, IsNumber, IsObject, IsPositive, IsString, ValidateNested } from 'class-validator';

export enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

class SecurityRequest {
  @IsString()
  maxPayloadSize: string;

  @IsNumber()
  @IsPositive()
  maxTimeOffsetInSeconds: number;

  @IsArray()
  @IsString({ each: true })
  allowedHosts: string[];

  @IsArray()
  @IsString({ each: true })
  allowedForwardedIps: string[];
}

class SecurityCORS {
  @IsArray()
  @IsString({ each: true })
  whitelist: string[];

  @IsArray()
  @IsString({ each: true })
  methods: string[];
}

class RateLimiterDefault {
  @IsNumber()
  @IsPositive()
  points: number;

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsNumber()
  @IsPositive()
  blockDuration: number;
}

class SecurityRateLimiter {
  @IsBoolean()
  enabled: boolean;

  @IsObject()
  @Type(() => RateLimiterDefault)
  @ValidateNested()
  default: RateLimiterDefault;
}

class Security {
  @IsObject()
  @Type(() => SecurityRequest)
  @ValidateNested()
  request: SecurityRequest;

  @IsObject()
  @Type(() => SecurityCORS)
  @ValidateNested()
  cors: SecurityCORS;

  @IsObject()
  @Type(() => SecurityRateLimiter)
  @ValidateNested()
  rateLimiter: SecurityRateLimiter;
}

class TransporterOptions {
  @IsBoolean()
  silent: boolean;
}

class Logging {

  @IsObject()
  @Type(() => TransporterOptions)
  @ValidateNested()
  console: TransporterOptions;

  @IsObject()
  @Type(() => TransporterOptions)
  @ValidateNested()
  error: TransporterOptions;

  @IsObject()
  request: {
    file: TransporterOptions;
  };
}

export class EnvironmentVariables {

  @IsEnum(Environment)
  @IsIn(Object.values(Environment))
  NODE_ENV = Environment.Development;

  @IsNumber()
  PORT: number;

  @IsString()
  API_URL: string;

  @IsString()
  APP_VIRUTAL_PATH: string;

  @IsString()
  ELASTICSEARCH_CLIENT_NAME: string;

  @IsString()
  ELASTICSEARCH_USERNAME: string;

  @IsString()
  ELASTICSEARCH_PASSWORD: string;

  @IsString()
  ELASTICSEARCH_NODES: string;

}

export class JsonConfigVariables {

  @IsObject()
  @Type(() => Security)
  @ValidateNested()
  security: Security;

  @IsObject()
  @Type(() => Logging)
  @ValidateNested()
  logging: Logging;

}


