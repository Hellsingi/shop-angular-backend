import { handlerPath } from '@libs/handlerResolver';
import schema from '@functions/create-product/schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schema: {
            'application/json': schema,
          },
        },
        cors: true,
      },
    },
  ],
};
