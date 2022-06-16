import { getFilmsService } from "../services/FilmService";

describe("FilmService -> getFilms()", () => {
  test("return all films", async () => {
    const { data } = await getFilmsService();
    expect(data.results.length).toBe(6);
  });
});
