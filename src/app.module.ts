import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { BusinessModule } from './business/business.module';
import { AuthModule } from './auth/auth.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    BusinessModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
