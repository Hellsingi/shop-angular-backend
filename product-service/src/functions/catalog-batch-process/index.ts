import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.catalogBatch`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: '${cf:import-service-dev.SQSArn}',
      },
    },
  ],
};
