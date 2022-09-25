import { getFilmById } from "@functions/get-products-by-id/handler";
import { filmService } from "../../film-service";

const mockResult = {
    "count": 4,
    "description": "Short Film  Description1",
    "id": "1",
    "price": 2.4,
    "title": "Film One"
};

const event = {
    pathParameters: {
        id: '1'
    }
}

describe("get film by id tests", () => {
    it('should get film by id', async () => {
        const result = await getFilmById(event);
        expect(JSON.parse(result.body)).toEqual(mockResult);
        expect(result.statusCode).toBe(200)
    });

    it('should get an error with wrong film id', async () => {
        const event = {
            pathParameters: {
                id: 'over9000'
            }
        }
        const result = await getFilmById(event);
        expect(JSON.parse(result.body)).toEqual({ message: "Film not found" });
        expect(result.statusCode).toBe(404)
    });

    it('should get 500 error if something wrong in BD service method', async () => {
         filmService .getFilmById = jest.fn(() => {
            throw new Error()
        });
        const result = await getFilmById(event);
        expect(result.statusCode).toBe(500);
    });

})