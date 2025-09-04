import { Inject, Injectable } from '@nestjs/common';

import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { parse } from 'dotenv';

import { readFileSync } from 'fs';
import { join } from 'path';

import { CONFIG_MODULE_OPTIONS } from '@config/config.constants';
import { ConfigModuleOptions } from '@config/interfaces/config-options.interface';
import {
  EnvironmentVariables,
  JsonConfigVariables
} from '@config/model/env.model';


@Injectable()
export class ConfigService {
  private readonly envConfig: EnvironmentVariables & JsonConfigVariables;

  constructor(@Inject(CONFIG_MODULE_OPTIONS) options: ConfigModuleOptions) {
    const { dir, fileName, jsonFileName, useProcess } = options;

    if (!fileName && !jsonFileName && !useProcess) {
      throw new Error(
        'common.errors.configurationError'
      );
    }

    let envConfig: Record<string, any> = {};
    let jsonConfig: Record<string, any> = {};

    if (!useProcess && fileName) {
      process.env.PWD = process.env.PWD ? process.env.PWD : process.cwd();
      envConfig = parse(readFileSync(join(process.env.PWD, dir, fileName)));
    } else {
      envConfig = process.env;
    }

    if (jsonFileName) {
      process.env.PWD = process.env.PWD ? process.env.PWD : process.cwd();
      const jsonPath = join(process.env.PWD, dir, jsonFileName);
      jsonConfig = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    }

    this.envConfig = {
      ...this.validateConfig(envConfig, EnvironmentVariables),
      ...this.validateConfig(jsonConfig, JsonConfigVariables)
    };
  }

  private validateConfig<T extends object>(
    config: Record<string, any>,
    schema: ClassConstructor<T>
  ): T {
    const validatedConfig = plainToClass(schema, config, {
      enableImplicitConversion: true
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get isProd(): boolean {
    const env = this.nodeEnv.toLowerCase();
    return env === 'production';
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get appVirutalPath(): string {
    return this.envConfig.APP_VIRUTAL_PATH;
  }

  get apiUrl(): string {
    return this.envConfig.API_URL;
  }

  get security() {
    return this.envConfig.security;
  }

  get rateLimiter() {
    return this.envConfig.security.rateLimiter;
  }

  get maxPayloadSize(): string {
    return this.envConfig.security.request.maxPayloadSize;
  }

  get maxTimeOffsetInSeconds(): number {
    return this.envConfig.security.request.maxTimeOffsetInSeconds;
  }

  get cors() {
    return this.envConfig.security.cors;
  }

  get allowedHosts() {
    return this.envConfig.security.request.allowedHosts;
  }
}
