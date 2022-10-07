import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';
dotenv.config();
import { importFileParser, importProductsFile } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
      BUCKET_NAME: process.env.BUCKET_NAME,
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}`,
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
      },
    ],
  },
  resources: {
    Resources: {
      CsvImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: process.env.BUCKET_NAME,
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
              Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
              Principal: {
                AWS: '*',
              },
            },
          },
        },
      },
    },
  },

  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
