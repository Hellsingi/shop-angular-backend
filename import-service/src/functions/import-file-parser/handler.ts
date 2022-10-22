import * as AWS from 'aws-sdk';
import csv from 'csv-parser';
import 'source-map-support/register';
import { S3Event, S3Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { Transform } from 'stream';
import { SQS } from 'aws-sdk';
import { sendCustomResponse, sendError } from '../../utils/responses';

import dotenv from 'dotenv';
dotenv.config();

const { BUCKET_NAME, SOURCE_FOLDER, TARGET_FOLDER, SQS_QUEUE_URL } =
  process.env;

const sendRecordsToQueue = (
  s3: AWS.S3,
  source: string,
  sqs: SQS
): Promise<Transform> => {
  const csvReadStream = s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: source,
    })
    .createReadStream();

  const transformRecordsStream = csvReadStream.pipe(csv());

  transformRecordsStream.on('data', (parsedRecord) => {
    console.log('sendRecordsToQueue parsedRecord:', parsedRecord);
    sqs.sendMessage(
      {
        MessageBody: JSON.stringify(parsedRecord),
        QueueUrl: SQS_QUEUE_URL,
      },
      (err, data) => {
        if (err) {
          console.error('transformRecordsStream error:', err);
          return;
        }
        console.log('transformRecordsStream data:', data);
      }
    );
  });

  return new Promise(
    (resolve, reject): Transform =>
      transformRecordsStream.on('error', reject).on('end', resolve)
  );
};

const copyCsvFile = (s3: AWS.S3, source: string) => {
  return s3
    .copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${source}`,
      Key: source.replace(SOURCE_FOLDER, TARGET_FOLDER),
    })
    .promise();
};

const deleteCsvFile = (s3: AWS.S3, source: string) => {
  return s3
    .deleteObject({
      Bucket: BUCKET_NAME,
      Key: source,
    })
    .promise();
};

const importFileParser: S3Handler = async (event: S3Event): Promise<any> => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new SQS();

    for (const record of event.Records) {
      const source = decodeURIComponent(
        record.s3.object.key.replace(/\+/g, ' ')
      );

      const fileName = source.replace(`${SOURCE_FOLDER}/`, '');

      await sendRecordsToQueue(s3, source, sqs);
      await copyCsvFile(s3, source);
      await deleteCsvFile(s3, source);

      console.log(
        `File ${fileName} was moved from /${SOURCE_FOLDER} to /${TARGET_FOLDER}`
      );
    }
    return sendCustomResponse({ message: 'OK' }, 200);
  } catch (error) {
    console.log('ImportFileParser error:', JSON.stringify(error));
    return sendError(error);
  }
};

export const main = middyfy(importFileParser);
