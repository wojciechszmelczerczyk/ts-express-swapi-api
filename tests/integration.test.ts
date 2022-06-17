import server from "../utils/createServer";
import request from "supertest";
import { createDB, flushDBs, resetSequence } from "./hooks/db";

let app;

beforeAll(async () => {
  // run express server
  app = server();

  // delete tables rows
  await flushDBs();

  // reset sequences
  await resetSequence();

  // arbitrary lists
  let names = [
    "Old Saga",
    "Ice Saga",
    "Fire Saga",
    "God Saga",
    "Titan Saga",
    "Dark Saga",
    "Light Saga",
  ];

  // create table in db for each name for test purposes
  for (let i = 0; i < names.length; i++) {
    await createDB(names[i]);
  }
});

afterAll(async () => {
  // flush all dbs
  await flushDBs();
  // reset sequential values
  await resetSequence();
});

describe("GET /films", () => {
  test("return all films", async () => {
    const res = await request(app).get("/films");

    expect(res.status).toBe(200);

    // results array contain all films in https://swapi.dev/api/films API which number is 6.
    expect(res.body.length).toBe(6);
  });
});

describe("GET /films/:id", () => {
  test("when provided id is valid return specific film", async () => {
    const id = "2";
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(200);

    // Title of film with id 2 is The Empire Strikes Back.
    expect(res.body.title).toBe("The Empire Strikes Back");
  });

  test("when provided id is not a numeric value, return error message", async () => {
    const id = "id";
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.err).toBe("id has to be number");
  });

  test("when film with provided id doesn't exist, return error message", async () => {
    const id = "7";
    const res = await request(app).get(`/films/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.err).toBe("film with this id doesn't exist");
  });
});

describe("POST /favorites", () => {
  test("when list with provided name exist and film id is correct, add film with provided id to list", async () => {
    let listName = "Old Saga";

    let id = "2";

    const res = await request(app)
      .post("/favorites")
      .send({ id, name: listName });

    // film with id 2 (which title is The Empire Strikes Back) was added to Old Saga list.
    expect(res.body.film.title).toBe("The Empire Strikes Back");
  });

  test("when list with provided name doesn't exist and film id is correct, create new list and add film with provided id to it", async () => {
    let listName = "New Saga";

    let id = "2";

    const res = await request(app)
      .post("/favorites")
      .send({ id, name: listName });

    // new list with New Saga name was created
    expect(res.body.filmList.name).toBe("New Saga");

    // film with id 2 was added to new list
    expect(res.body.film.title).toBe("The Empire Strikes Back");
  });

  test("when film with provided id doesn't exist, return error", async () => {
    let listName = "New Saga";

    let id = "7";

    const res = await request(app)
      .post("/favorites")
      .send({ id, name: listName });

    expect(res.body.err).toBe("film with this id doesn't exist");
  });

  test("when provided id is not a numeric value, return error", async () => {
    let listName = "New Saga";

    let id = "ss";

    const res = await request(app)
      .post("/favorites")
      .send({ id, name: listName });

    expect(res.body.err).toBe("id has to be number");
  });

  test("when added film with provided id already exist in list, return duplicate error", async () => {
    let listName = "New Saga";

    let id = "2";

    const res = await request(app)
      .post("/favorites")
      .send({ id, name: listName });

    expect(res.body.err).toBe(
      "film duplication error. Film with this id already exist in list"
    );
  });
});

describe("GET /favorites", () => {
  test("when name query is not provided, return all lists", async () => {
    const res = await request(app).get("/favorites");

    // number of list tables added each time tests launch
    expect(res.body.length).toBe(8);
  });

  test("when name query is provided, return list by name", async () => {
    const name = "New Saga";
    const res = await request(app).get("/favorites").query({ name });

    expect(res.body.name).toBe(name);
  });

  test("when page query is provided, return paginated lists by default 5", async () => {
    const page = 1;
    const res = await request(app).get("/favorites").query({ page });
    expect(res.body.length).toBe(5);
  });

  test("when query page is not a numeric value, return error", async () => {
    const page = "x";
    const res = await request(app).get("/favorites").query({ page });
    expect(res.body.err).toBe("Provided page value is not a number");
  });

  test("when limit query is provided, return specified number of lists", async () => {
    const page = 2;
    const limit = 3;
    const res = await request(app).get("/favorites").query({ page, limit });
    expect(res.body.length).toBe(3);
  });
});

describe("GET favorites/:id", () => {
  test("when provided id is correct, return specific list with correlated films", async () => {
    // New Saga list id
    const id = 8;

    const res = await request(app).get(`/favorites/${id}`);

    expect(res.body.name).toBe("New Saga");
  });

  test("when provided id is not a number value, return error message", async () => {
    const id = "ss";
    const res = await request(app).get(`/favorites/${id}`);
    expect(res.body.err).toBe("Provided id has to be a number.");
  });
});
