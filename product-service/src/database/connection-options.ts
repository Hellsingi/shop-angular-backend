import { DataSource } from 'typeorm';
import { FilmEntity } from '../entities/film.entity';
import { StockEntity } from '../entities/stock.entity';
import dotenv from 'dotenv';

dotenv.config();

export const connectionOptions: DataSource = new DataSource({
  name: `default`,
  type: `postgres`,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [FilmEntity, StockEntity],
  migrations: ['src/migrations/*.ts'],

  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  // cli: {
  //   migrationsDir: 'src/migrations',
  // },
});
