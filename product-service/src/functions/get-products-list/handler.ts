import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from "../../utils/responses";
import { filmService } from "../../film-service";

export const getFilmList = async () => {
    try {
        const films = await filmService.getFilmList();
        return sendCustomResponse({
          films
        }, 200)
    } catch (e) {
        return sendError(e);
    }
}

export const getProductList = middyfy(getFilmList);
