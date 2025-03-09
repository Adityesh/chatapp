import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationService } from '../configuration/configuration.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async (config: ConfigurationService) => {
        return {
          type: 'postgres',
          url: config.get('DB_CONNECTION_STRING'),
          database: config.get('DB_DATABASE'),
          schema: config.get('DB_SCHEMA'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrationsTableName: 'chatapp_migrations',
          autoLoadEntities: true,
          migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
          seeds: [__dirname + '/database/seeds/**/*{.ts,.js}'],
          factories: [__dirname + '/database/factories/**/*{.ts,.js}'],
          cli: {
            migrationsDir: __dirname + '/database/migrations/',
          },
          migrationsRun: true,
          logging: ['error'],
        } as TypeOrmModuleOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
