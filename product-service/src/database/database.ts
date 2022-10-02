import { ConnectionManager, DataSource, getConnectionManager } from 'typeorm';
import connectionOptions from './connection-options';

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

    const connectDB = new DataSource(connectionOptions);
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
