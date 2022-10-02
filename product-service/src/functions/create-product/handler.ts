import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { filmService } from '../../services/fils-service';
import { FilmDto } from '../../dto/film.dto';

export const createFilm = async (event) => {
  try {
    console.log(`Create film event: ${JSON.stringify(event)}`);
    const body = event.body as FilmDto;
    const film = await filmService.createFilm(body);
    console.log(`Created film: ${JSON.stringify(film)}`);
    return sendCustomResponse(film, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const createProduct = middyfy(createFilm);
