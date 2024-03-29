import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './src/entity';
// import { Initial1710993979782 } from 'src/migrations/1710993979782-initial';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/**/migrations/*{.ts,.js}'],
});
