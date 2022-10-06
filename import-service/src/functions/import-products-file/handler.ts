import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';

export const importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    const fileName = event.queryStringParameters.name;

    const path = `uploads/${fileName}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: path,
      ContentType: 'text/csv',
    };
    console.log(params);
    const url = await s3.getSignedUrlPromise('putObject', params);
    return sendCustomResponse({ url }, 200);
  } catch (error) {
    return sendError(error);
  }
};

export const main = middyfy(importProductsFile);
