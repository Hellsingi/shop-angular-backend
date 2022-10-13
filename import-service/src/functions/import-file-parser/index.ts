import { handlerPath } from '@libs/handler-resolver';
import dotenv from 'dotenv';
dotenv.config();

const { BUCKET_NAME, SOURCE_FOLDER } = process.env;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: `${SOURCE_FOLDER}/`,
          },
        ],
        existing: true,
      },
    },
  ],
};
