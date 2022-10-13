import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { sendCustomResponse, sendError } from '../../utils/responses';
import dotenv from 'dotenv';
dotenv.config();

const { BUCKET_NAME, SOURCE_FOLDER } = process.env;

export const importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    const fileName = event.queryStringParameters.name;

    const path = `${SOURCE_FOLDER}/${fileName}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: path,
      ContentType: 'text/csv',
    };
    console.log('importProductsFile params:', params);
    const url = await s3.getSignedUrlPromise('putObject', params);
    return sendCustomResponse({ url }, 200);
  } catch (error) {
    return sendError(error);
  }
};

export const main = middyfy(importProductsFile);
