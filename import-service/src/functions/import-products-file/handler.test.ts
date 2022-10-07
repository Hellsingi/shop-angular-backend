import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '@functions/import-products-file/handler';
import AWS from 'aws-sdk';

const file = 'mock';
const mockUrl = `https://mock.com/uploads/${file}`;
const event = {
  queryStringParameters: {
    name: file,
  },
};

const errorMessage = 'Oops error in sign url function';

describe('import products file lambda handler tests', () => {
  afterEach(() => {
    AWSMock.restore();
  });
  it('should get equal signed url', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', mockUrl);
    const res = await importProductsFile(event);
    expect(JSON.parse(res.body).url).toEqual(mockUrl);
    expect(res.statusCode).toBe(200);
  });

  it('should get error message if sign function throw error', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', () => {
      throw new Error(errorMessage);
    });
    const res = await importProductsFile(event);
    expect(JSON.parse(res.body)).toEqual({ message: errorMessage });
    expect(res.statusCode).toBe(500);
  });
});
