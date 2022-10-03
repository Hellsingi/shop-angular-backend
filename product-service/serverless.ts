import type { AWS } from '@serverless/typescript';
import {
  getProductsList,
  getProductsById,
  createProduct,
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
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: process.env.DB_HOST,
      PG_PORT: process.env.DB_PORT,
      PG_DATABASE: process.env.DB_NAME,
      PG_USERNAME: process.env.DB_USERNAME,
      PG_PASSWORD: process.env.DB_PASSWORD,
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
};

module.exports = serverlessConfiguration;
