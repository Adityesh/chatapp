import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import configuration from '../configuration/configuration';

config();

const validatedEnv = configuration();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: validatedEnv.DB_CONNECTION_STRING,
  database: validatedEnv.DB_DATABASE,
  schema: validatedEnv.DB_SCHEMA,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*.ts'],
  migrationsTableName: 'chatapp_migrations',
  migrationsTransactionMode: 'each',
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
