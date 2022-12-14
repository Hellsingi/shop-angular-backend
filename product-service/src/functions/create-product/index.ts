import { handlerPath } from '@libs/handler-resolver';
import schema from '@functions/create-product/schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: true,
      },
    },
  ],
};
