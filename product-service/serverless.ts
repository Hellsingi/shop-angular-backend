import type { AWS } from '@serverless/typescript';
import {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess,
} from '@functions/index';
import dotenv from 'dotenv';
dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: { forceInclude: ['pg'] },
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: process.env.DB_HOST,
      PG_PORT: process.env.DB_PORT,
      PG_DATABASE: process.env.DB_NAME,
      PG_USERNAME: process.env.DB_USERNAME,
      PG_PASSWORD: process.env.DB_PASSWORD,
      SNS_TOPIC_NAME: process.env.SNS_TOPIC_NAME,
      SNS_SUBSCRIPTION_EMAIL: process.env.SNS_SUBSCRIPTION_EMAIL,
      SNS_TOPIC_ARN: {
        Ref: 'SNSTopic',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic',
        },
      },
    ],
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: process.env.SNS_TOPIC_NAME,
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.SNS_SUBSCRIPTION_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
      SNSSubscriptionFilterByCount: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.SNS_SUBSCRIPTION_EMAIL_FILTER_COUNT,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            count: [{ numeric: ['>=', 12] }],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
