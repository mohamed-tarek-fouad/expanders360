import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf
} from 'class-validator';

import { ValidateDeviceHeaders } from '@core/decorators/device-headers.decorator';

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum Language {
  English = 'en',
  Arabic = 'ar',
}

export class RequestHeadersDto {
  @IsEnum(Language, {
    message: 'common.errors.headers.acceptLanguageHeaderInvalid'
  })
  'accept-language': Language;

  @IsUUID(undefined, {
    message: 'common.errors.headers.xRequestIdHeaderInvalid'
  })
  'x-request-id': string;

  @IsString({
    message: 'common.errors.headers.xRequestTimeHeaderInvalid'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
    message: 'common.errors.headers.xRequestTimeHeaderInvalid'
  })
  'x-request-time': string;

  @IsString({
    message: 'common.errors.headers.xClientNameHeaderRequired'
  })
  @MinLength(1, {
    message: 'common.errors.headers.xClientNameHeaderInvalid'
  })
  @MaxLength(1024, {
    message: 'common.errors.headers.xClientNameHeaderInvalid'
  })
  'x-client-name': string;

  @IsString({
    message: 'common.errors.headers.xClientVersionHeaderRequired'
  })
  @Matches(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/, {
    message: 'common.errors.headers.xClientVersionHeaderInvalid'
  })
  'x-client-version': string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, {
    message: 'common.errors.headers.xClientBuildNumberHeaderInvalid'
  })
  @Min(1, {
    message: 'common.errors.headers.xClientBuildNumberHeaderInvalid'
  })
  @IsInt()
  'x-client-build-number'?: number;

  @IsEnum(Environment, {
    message: 'common.errors.headers.xClientEnvironmentHeaderInvalid'
  })
  'x-client-environment': Environment;

  @ValidateDeviceHeaders()
  @IsOptional()
  @IsString({
    message: 'common.errors.headers.xDeviceIdHeaderInvalid'
  })
  @MinLength(1, {
    message: 'common.errors.headers.xDeviceIdHeaderInvalid'
  })
  @MaxLength(1024, {
    message: 'common.errors.headers.xDeviceIdHeaderInvalid'
  })
  'x-device-id'?: string;

  @ValidateDeviceHeaders()
  @IsOptional()
  @IsString({
    message: 'common.errors.headers.xDeviceManufacturerHeaderInvalid'
  })
  @MinLength(1, {
    message: 'common.errors.headers.xDeviceManufacturerHeaderInvalid'
  })
  @MaxLength(1024, {
    message: 'common.errors.headers.xDeviceManufacturerHeaderInvalid'
  })
  'x-device-manufacturer'?: string;

  @ValidateDeviceHeaders()
  @IsOptional()
  @IsString({
    message: 'common.errors.headers.xDeviceModelIdentifierHeaderInvalid'
  })
  @MinLength(1, {
    message: 'common.errors.headers.xDeviceModelIdentifierHeaderInvalid'
  })
  @MaxLength(1024, {
    message: 'common.errors.headers.xDeviceModelIdentifierHeaderInvalid'
  })
  'x-device-model-identifier'?: string;

  @ValidateDeviceHeaders()
  @IsOptional()
  @IsString({
    message: 'common.errors.headers.xDeviceModelNameHeaderInvalid'
  })
  @MinLength(1, {
    message: 'common.errors.headers.xDeviceModelNameHeaderInvalid'
  })
  @MaxLength(1024, {
    message: 'common.errors.headers.xDeviceModelNameHeaderInvalid'
  })
  'x-device-model-name'?: string;

  @ValidateIf((o) => o['x-geo-longitude'] !== undefined)
  @Type(() => Number)
  @IsNumber({}, {
    message: 'common.errors.headers.xGeoLatitudeHeaderInvalid'
  })
  @Min(-90, {
    message: 'common.errors.headers.xGeoLatitudeHeaderInvalid'
  })
  @Max(90, {
    message: 'common.errors.headers.xGeoLatitudeHeaderInvalid'
  })
  'x-geo-latitude'?: number;

  @ValidateIf((o) => o['x-geo-latitude'] !== undefined)
  @Type(() => Number)
  @IsNumber({}, {
    message: 'common.errors.headers.xGeoLongitudeHeaderInvalid'
  })
  @Min(-180, {
    message: 'common.errors.headers.xGeoLongitudeHeaderInvalid'
  })
  @Max(180, {
    message: 'common.errors.headers.xGeoLongitudeHeaderInvalid'
  })
  'x-geo-longitude'?: number;
}