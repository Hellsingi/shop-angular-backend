import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { filmService } from '../../services/film-service';

export const getFilmById = async (event) => {
  try {
    const filmId = await event.pathParameters.id;
    const film = await filmService.getFilmById(filmId);
    if (!film) {
      return sendCustomResponse({ message: 'Film not found' }, 404);
    }
    return sendCustomResponse(film, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const getProductById = middyfy(getFilmById);
