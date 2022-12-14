import type { AWS } from '@serverless/typescript';
import { GatewayResponseType } from 'aws-sdk/clients/apigateway';
import dotenv from 'dotenv';
dotenv.config();
import { importFileParser, importProductsFile } from '@functions/index';

const { BUCKET_NAME, SQS_QUEUE_NAME } = process.env;

const enableGatewayResponseCors = (responseType: GatewayResponseType) => {
  return {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      RestApiId: {
        Ref: 'ApiGatewayRestApi',
      },
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
      },
      ResponseType: responseType,
    },
  };
};

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-pseudo-parameters',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET_NAME: BUCKET_NAME,
      SQS_QUEUE_NAME: SQS_QUEUE_NAME,
      SQS_QUEUE_URL: {
        Ref: 'SQSQueue',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET_NAME}`,
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    ],
  },
  resources: {
    Resources: {
      ApiGatewayRestApi: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: {
            'Fn::Sub': '${AWS::StackName}',
          },
        },
      },
      ResponseUnauthorized: enableGatewayResponseCors('UNAUTHORIZED'),
      ResponseAccessDenied: enableGatewayResponseCors('ACCESS_DENIED'),
      CsvImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: BUCKET_NAME,
          AccessControl: 'Private',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                AllowedOrigins: ['*'],
              },
            ],
          },
        },
      },
      CsvImportBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'CsvImportBucket',
          },
          PolicyDocument: {
            Statement: {
              Sid: 'AllowPublicRead',
              Effect: 'Allow',
              Action: 's3:GetObject',
              Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
              Principal: {
                AWS: '*',
              },
            },
          },
        },
      },
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: SQS_QUEUE_NAME,
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
    },
    Outputs: {
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    },
  },

  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
