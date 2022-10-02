import { ConnectionOptions } from 'typeorm';
import { FilmEntity } from '../entities/film.entity';
import { StockEntity } from '../entities/stock.entity';

const connectionOptions: ConnectionOptions = {
  name: `default`,
  type: `postgres`,
  port: Number(process.env.DB_PORT),
  synchronize: true,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [FilmEntity, StockEntity],
  migrations: ['src/migrations/*.ts']
};

export default connectionOptions;
