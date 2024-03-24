import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
  factories: ['dist/src/database/seeder/**/*.factory{.ts,.js}'],
  seeds: ['dist/src/database/seeder/*.seed{.ts,.js}'],
  seedTracking: true,
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
