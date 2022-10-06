import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: process.env.BUCKET_NAME,
        event: 's3:ObjectCreated:*',
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
