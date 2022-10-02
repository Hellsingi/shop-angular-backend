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
    console.log(`Start connection: ${JSON.stringify(connection)}`);
    const myDataSource = new DataSource(connectionOptions);
    return await myDataSource.initialize();
  }
}
