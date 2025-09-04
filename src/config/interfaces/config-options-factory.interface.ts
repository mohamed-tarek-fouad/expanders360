// config-options-factory.interface.ts

import { ConfigModuleOptions } from '@config/interfaces/config-options.interface';

export interface ConfigModuleFactory {
  createModuleConfig(): ConfigModuleOptions | Promise<ConfigModuleOptions>;
}
