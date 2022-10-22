import { getFilmById } from '@functions/get-product-by-id/handler';
import { filmService } from '../../services/film-service';

const mockResult = {
  count: 13,
  description: 'Short Film  Description1',
  id: '3aa94e93-c9f6-4f51-8aef-74ae43d0d246',
  price: 2,
  title: 'Film One',
};

const event = {
  pathParameters: {
    id: '3aa94e93-c9f6-4f51-8aef-74ae43d0d246',
  },
};

describe('get film by id tests', () => {
  it('should get film by id', async () => {
    const result = await getFilmById(event);
    expect(JSON.parse(result.body)).toEqual(mockResult);
    expect(result.statusCode).toBe(200);
  });

  it('should get an error with wrong film id', async () => {
    const eventFalse = {
      pathParameters: {
        id: '3aa94e93-c9f6-4f51-8aef-74ae43d0d266',
      },
    };
    const result = await getFilmById(eventFalse);
    expect(JSON.parse(result.body)).toEqual({ message: 'Film not found' });
    expect(result.statusCode).toBe(404);
  });

  it('should get 500 error if something wrong in BD service method', async () => {
    filmService.getFilmById = jest.fn(() => {
      throw new Error();
    });
    const result = await getFilmById(event);
    expect(result.statusCode).toBe(500);
  });
});
