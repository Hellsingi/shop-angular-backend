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
    } catch (err) {
      console.log('getFilmList Error:', err);
      throw err;
    } finally {
      await connection.destroy();
    }
  }

  async getFilmById(filmId: string): Promise<FilmEntity | undefined> {
    const connection = await this.database.getConnection();
    try {
      console.log('getFilmById filmId:', filmId);
      return await connection
        .getRepository(FilmEntity)
        .findOne({ relations: ['stock'], where: { id: filmId } });
    } catch (err) {
      console.log('getFilmById Error:', err);
      throw err;
    } finally {
      await connection.destroy();
    }
  }

  async createFilm(body: FilmDto): Promise<FilmEntity> {
    try {
      const connection = await this.database.getConnection();
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const { title, description, price, count } = body;
        const film = await connection
          .getRepository(FilmEntity)
          .save({ title, description, price });
        queryRunner.manager
          .getRepository(StockEntity)
          .save({ count, filmId: film.id });
        await queryRunner.commitTransaction();
        film.count = count;
        return film;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('createFilm Error:', err);
        throw err;
      } finally {
        await queryRunner.release();
        await connection.destroy();
      }
    } catch (error) {
      console.error('createFilm global error:', error);
      throw error;
    }
  }
}
export const filmService = new FilmService();
