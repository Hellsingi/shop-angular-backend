import { FilmServiceInterface } from '../utils/types';
import { FilmEntity } from '../entities/film.entity';
import { Database } from '../database/database';
import { FilmDto } from '../dto/film.dto';
import { StockEntity } from '../entities/stock.entity';

class FilmService implements FilmServiceInterface {
  private database: Database;
  constructor() {
    this.database = new Database();
  }
  async getFilmList(): Promise<FilmEntity[]> {
    const connection = await this.database.getConnection();
    try {
      return await connection
        .getRepository(FilmEntity)
        .find({ relations: ['stock'] });
    } finally {
      await connection.close();
    }
  }

  async getFilmById(filmId: string): Promise<FilmEntity> {
    const connection = await this.database.getConnection();
    try {
      return await connection
        .getRepository(FilmEntity)
        .findOne({ relations: ['stock'], where: { id: filmId } });
    } finally {
      await connection.close();
    }
  }

  async createFilm(body: FilmDto): Promise<FilmEntity> {
    const connection = await this.database.getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { title, description, price, count } = body;
      const film = connection
        .getRepository(FilmEntity)
        .create({ title, description, price });
      await film.save();
      const stock = queryRunner.manager
        .getRepository(StockEntity)
        .create({ count, filmId: film.id });
      await stock.save();
      await queryRunner.commitTransaction();
      film.count = count;
      return film;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('createFilm error:', error);
      throw error;
    } finally {
      await queryRunner.release();
      await connection.close();
    }
  }
}
export const filmService = new FilmService();
