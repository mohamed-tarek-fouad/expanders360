import { ConfigModuleFactory } from '@config/interfaces/config-options-factory.interface';
import { ConfigModuleOptions } from '@config/interfaces/config-options.interface';

export class ConfigModuleConfig implements ConfigModuleFactory {
  createModuleConfig(): ConfigModuleOptions {
    const env = process.env.NODE_ENV;

    return {
      dir: 'config',
      fileName: !env ? '.env.development' : `.env.${env}`,
      jsonFileName: !env ? 'default.json' : `${env}.json`,
      useProcess: false
    };
  }
}
