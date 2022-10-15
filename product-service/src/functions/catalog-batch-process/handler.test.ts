import { catalogBatchProcess } from '@functions/catalog-batch-process/handler';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { filmService } from '../../services/film-service';
import { FilmEntity } from '../../entities/film.entity';

const event = {
  Records: [
    {
      messageId: 'ee9796cd-6100-44cb-9bc7-327df413d235',
      receiptHandle:
        'AQEBpxK9EgcPfHbP3wZhKQBwnatL8P3UmPSH7WzvdWbmEb0kSQpYHnDR9kcwKtajWw+IYRUw9cINR+nv/mob1T1bbMfTLOT7rz1giDhDAwZPhcQW3tz/i3VB9LUfAEvYSRQS8eUxGYIvIKJW8g0A2hJgtAP2STnmH9DNZIM9H/MHWc+b73b58qgAo7Qs2XeFaLCLKvdFr87RIqKjwiueNMIiNeGE5DYpT19PB0dcq0bH771Yk7tcNvbvKdrZxYdPAv+FAh3N24zPd0OHrRw4M31uifnPYS3bjZpu8mz0pDaoq23redxcXhyuyp86gjmSVejdrLnB9NPLQGSMEuP46QhWaAdOrOlka9ALHRvPd03FCkikDZMVgEIHxUGDBqVe6NrLP3FcB7LS+xM+tXCPxnrI6g==',
      body: '{"title":"test2000","description":"test20","price":"200","imageSrc":"test2","count":"10"}',
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1632961245629',
        SenderId: 'AROASNU67B3NXFOLJXWCJ:import-service-dev-importFileParser',
        ApproximateFirstReceiveTimestamp: '1632961245631',
      },
      messageAttributes: {},
      md5OfBody: 'c4643156e0606daac1bbc04f440da476',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:eu-west-1:166763368155:csv-import-sqs-queue',
      awsRegion: 'eu-west-1',
    },
    {
      messageId: '1e044ef4-8e09-4de5-8168-a0b4c1e25791',
      receiptHandle:
        'AQEB3ws4vg7DNvOwHMJvBEE3KZj6KxN8hpSU6A9yCXTrZ/OlCLLsXWG/gB3MdiT+Hic9rjKdiUrh7XvzplobwtJiBUt5bZli+T4Ief5tqqzjwSjzhDCOJL0VALNnKfRdfCbSKqiNcprMPPH5bBCmlIM59tbbuvswtrTHnVE9uFF/zTEph1aureFOv1DpREWMIhl2De8RbkRbx+Y4wOlE/VvrrqIjdXNAMNbpTd7gIxxXzzRfLUEZGxSS5e18v7mGufsXAtI9kWDZxOAI61R/uekiK3gq6qyogJdUwK5uRb8ZpOkhnlK/q4uWzGdHDJO/5ML6c4a/UJQjZRtrrHMEa9Yk3r7IekxScFyXm8L31gZRawMJ6TjarwDY3TRDaKTJ4l3ouS73jSmH/7y923M/CTRlwQ==',
      body: '{"title":"test3000","description":"test30","price":"100","imageSrc":"test3","count":"15"}',
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1632961245630',
        SenderId: 'AROASNU67B3NXFOLJXWCJ:import-service-dev-importFileParser',
        ApproximateFirstReceiveTimestamp: '1632961245631',
      },
      messageAttributes: {},
      md5OfBody: '8dba507907a76654720f8e638061cdb0',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:eu-west-1:166763368155:csv-import-sqs-queue',
      awsRegion: 'eu-west-1',
    },
  ],
};
describe('catalogBatchProcess', () => {
  afterEach(() => {
    AWSMock.restore();
  });
  it('should send 2 sns messages', async () => {
    const mockedSNSResponse = 'mockedResponse';
    const SNSPublish = jest.fn((_params, callback) =>
      callback(null, mockedSNSResponse)
    );
    AWSMock.setSDKInstance(AWS as any);
    AWSMock.mock('SNS', 'publish', SNSPublish);
    filmService.createFilm = jest.fn(() => {
      return {
        title: 'test4000',
        description: 'test40',
        price: '400',
        imageSrc: 'test4',
        count: '25',
      } as unknown as Promise<FilmEntity>;
    });
    await catalogBatchProcess(event, null, null);
    expect(SNSPublish).toHaveBeenCalledTimes(2);
    SNSPublish({} as any, (_err, data) => {
      expect(data).toBe(mockedSNSResponse);
    });
  });

  it('Should not send sns message when catch error in product service method, should log correct message', async () => {
    const mockedSNSResponse = 'mockedResponse';
    const SNSPublish = jest.fn((_params, callback) =>
      callback(null, mockedSNSResponse)
    );

    const consoleLogSpy = jest.spyOn(console, 'log');

    AWSMock.setSDKInstance(AWS as any);
    AWSMock.mock('SNS', 'publish', SNSPublish);
    filmService.createFilm = jest.fn(() => {
      throw new Error('Oops');
    });
    await catalogBatchProcess(event, null, null);
    expect(SNSPublish).toHaveBeenCalledTimes(0);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Error in handleSingleProductProcess: Error: Oops'
    );
  });
});
