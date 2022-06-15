import server from "../utils/createServer";
import request from "supertest";

const app = server();

describe("GET /films", () => {
  test("when id is not provided return all films", async () => {
    const res = await request(app).get("/films");

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
});

describe("GET /films/:id", () => {
  test("when provided id is valid return specific film", async () => {
    const id = 2;
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });

  test("when provided id is not a numeric value, return error message", async () => {
    const id = "id";
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.err).toBe("id has to be number");
  });

  test("when film with provided id doesn't exist, return error message", async () => {
    const id = 7;
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.err).toBe("film with this id doesn't exist");
  });
});
