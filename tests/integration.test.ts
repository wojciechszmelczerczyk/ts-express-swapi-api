import server from "../utils/createServer";
import request from "supertest";

describe("GET /films/:id?", () => {
  const app = server();
  test("when id is not provided return all films", async () => {
    const res = await request(app).get("/films");

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
  test("when id is provided return specific film", async () => {
    const id = 2;
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
