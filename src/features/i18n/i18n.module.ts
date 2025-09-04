import * as path from 'path';

import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';


@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve(__dirname, '../../features/i18n'),
        watch: true
      },
      resolvers: [AcceptLanguageResolver]
    })
  ],
  exports: [I18nModule]
})
export class I18nConfigModule {}
