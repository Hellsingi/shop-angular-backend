import * as lambda from "aws-lambda";
import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import { filmService } from '../../services/film-service';

const catalogBatchProcess = async (event: lambda.SQSEvent) => {  
  try {
    const films = event.Records.map((record) => record.body);
    console.log(`Films to save: ${films}`);
    for(const film of films) {
      const filmInfo = JSON.parse(film);
      console.log('Film info is:', filmInfo);
      const filmCreated=await filmService.createFilm(filmInfo)
      console.log('Filmcreated:', filmCreated);
    }

    return sendCustomResponse(
      {
        message: 'Success batch'
      },
      200
    );
  } catch (e) {
    return sendError(e);
  }
};

export const catalogBatch = middyfy(catalogBatchProcess);
