import 'module-alias/register';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nService } from 'nestjs-i18n';

import { configure } from '@config.main';
import { ConfigService } from '@config/config.service';

import { AppModule } from '@app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const i18nService = app.get(I18nService);

  const port = config.port;

  configure(app, config, i18nService as I18nService);

  await app.listen(port, () => {
    Logger.verbose(
      `🚀 Server listening on PORT:${port} | ${config.nodeEnv} | ${config.apiUrl}`
    );
  });
}
void bootstrap();
