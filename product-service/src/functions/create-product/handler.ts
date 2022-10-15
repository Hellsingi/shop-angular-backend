import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { filmService } from '../../services/film-service';
import { FilmDto } from '../../dto/film.dto';

export const createFilm: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body as unknown as FilmDto;
    console.log(`Create film body: ${JSON.stringify(body)}`);
    const film = await filmService.createFilm(body);
    return sendCustomResponse(film, 200);
  } catch (e) {
    return sendError(e);
  }
};

export const createProduct = middyfy(createFilm);
