import { getFilmList } from '@functions/get-products-list/handler';
import { productList } from '../../utils/product-list';
import { filmService } from '../../film-service';

describe('get films test', () => {
  it('should get all films', async () => {
    const result = await getFilmList();
    expect(JSON.parse(result.body).products).toEqual(productList);
    expect(result.statusCode).toBe(200);
  });

  it('should get 500 error if something wrong in BD service method', async () => {
    filmService.getFilmList = jest.fn(() => {
      throw new Error();
    });
    const result = await getFilmList();
    expect(result.statusCode).toBe(500);
  });
});
