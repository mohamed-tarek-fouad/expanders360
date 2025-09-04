import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

import { ConfigService } from '@config/config.service';
import { CONFIG_MODULE_OPTIONS } from '@config/config.constants';
import { ConfigModuleFactory } from '@config/interfaces/config-options-factory.interface';

@Module({})
export class ConfigModule {

  static forRootAsync(options: {
    useClass: Type<ConfigModuleFactory>;
  }): DynamicModule {
    const { useClass } = options;

    const optionsProvider: Provider = {
      provide: CONFIG_MODULE_OPTIONS,
      useFactory: async (configFactory: ConfigModuleFactory) =>
        await configFactory.createModuleConfig(),
      inject: [useClass]
    };

    return {
      module: ConfigModule,
      global: true,
      providers: [useClass, optionsProvider, ConfigService],
      exports: [ConfigService]
    };
  }

}
