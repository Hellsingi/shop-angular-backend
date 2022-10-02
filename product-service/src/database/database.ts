import { ConnectionManager, DataSource, getConnectionManager } from 'typeorm';
import { FilmEntity } from '../entities/film.entity';
import { StockEntity } from '../entities/stock.entity';
import dotenv from 'dotenv';
dotenv.config();

export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<DataSource> {
    const CONNECTION_NAME = `default`;
    let connection: DataSource;
    if (this.connectionManager.has(CONNECTION_NAME)) {
      connection = this.connectionManager.get(CONNECTION_NAME);
      if (connection.isInitialized) {
        await connection.destroy();
        console.log(`Excess connection killed`);
      }
    }

    const connectDB = new DataSource({
      name: CONNECTION_NAME,
      type: `postgres`,
      port: Number(process.env.DB_PORT),
      synchronize: false,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      entities: [FilmEntity, StockEntity],
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });

    connectDB
      .initialize()
      .then(() => {
        console.log(`Data Source has been initialized`);
      })
      .catch((err) => {
        console.error(`Data Source initialization error`, err);
      });

    return connectDB;
  }
}
