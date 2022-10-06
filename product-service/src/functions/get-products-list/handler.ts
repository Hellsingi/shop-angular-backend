import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { filmService } from '../../services/film-service';

export const getFilmList = async () => {
  try {
    const products = await filmService.getFilmList();
    return sendCustomResponse(
      {
        products,
      },
      200
    );
  } catch (e) {
    return sendError(e);
  }
};

export const getProductList = middyfy(getFilmList);
