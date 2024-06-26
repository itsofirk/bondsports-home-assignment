import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true, // Only for development, disable in production
    }),
    AccountModule,
  ],
})
export class AppModule {}
