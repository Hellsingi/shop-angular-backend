import {productList} from "./utils/product-list";
import {FilmInterface, FilmServiceInterface } from "./utils/types";

class FilmService implements FilmServiceInterface{
  getFilmList(): Promise<FilmInterface[]> {
      return Promise.resolve(productList)
  }

  getFilmById(filmId: string): Promise<FilmInterface> {
      return Promise.resolve(productList.find(film => film.id === filmId))
  }
}

export const filmService = new FilmService();