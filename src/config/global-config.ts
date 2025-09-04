import { ConfigService } from '@config/config.service';

const env = process.env.NODE_ENV;

export const GlobalConfigService = new ConfigService({
  dir: 'config',
  fileName: !env ? '.env.development' : `.env.${env}`,
  jsonFileName: !env ? 'default.json' : `${env}.json`,
  useProcess: false
});