import { filmService } from '../../services/film-service';
import { SNS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { SQSHandler } from 'aws-lambda';

export const handleSingleProductProcess = async (
  sns: SNS,
  recordBody: string
) => {
  try {
    const filmCreated = await filmService.createFilm(JSON.parse(recordBody));
    console.log(`Film created: ${recordBody}`);
    const response = await sns
      .publish({
        Subject: `Film with id ${filmCreated.id} created successfully`,
        Message: JSON.stringify(filmCreated),
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          count: {
            DataType: 'Number',
            StringValue: filmCreated.count.toString(),
          },
        },
      })
      .promise();
    console.log(`Send email with data: ${JSON.stringify(response)}`);
  } catch (e) {
    console.log(`Error in handleSingleProductProcess: ${e}`);
  }
};

export const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    console.log(`Event: ${JSON.stringify(event)}`);
    const sns = new SNS();
    const films = event.Records.map((record) => record.body);
    console.log(`Films to save: ${films}`);
    for (const film of films) {
      console.log(JSON.parse(film));
      await handleSingleProductProcess(sns, film);
    }
  } catch (e) {
    console.log(`Error during catalogBatchProcess: ${e}`);
  }
};

export const catalogBatch = middyfy(catalogBatchProcess);
