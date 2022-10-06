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
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_NAME, DB_PASSWORD } = process.env;

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
      port: Number(DB_PORT),
      synchronize: false,
      host: DB_HOST,
      username: DB_USERNAME,
      database: DB_NAME,
      password: DB_PASSWORD,
      entities: [FilmEntity, StockEntity],
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });

    try {
      await connectDB.initialize();
      console.log(`Data Source has been initialized`);
    } catch (err) {
      console.error(`Data Source initialization error`, err);
      throw err;
    }

    return connectDB;
  }
}
