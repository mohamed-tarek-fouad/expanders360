import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

export const MongoDBModule = MongooseModule.forRootAsync({
  useFactory: (): MongooseModuleOptions => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/expanders360_docs',
  }),
});
