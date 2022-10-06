import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        method: process.env.BUCKET_NAME,
        path: 's3:ObjectCreated',
        rules: [
          {
            prefix: 'uploads/',
          },
        ],
        existing: true,
      },
    },
  ],
};
