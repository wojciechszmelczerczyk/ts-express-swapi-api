# Swapi Middleware

## Description

Simple movies middleware.

## Table of content

- [Techstack](#techstack)
- [Prerequisities](#prerequisities)
- [To run](#to-run)
- [App architecture](#app-architecture)
- [Database architecture](#database-architecture)
- [Env setup](#env-setup)
- [Postman](#postman)
- [API](#api)
- [Tests](#tests)
  - [To run](#to-run-1)
  - [Hooks](#hooks)
  - [Unit](#unit)
  - [Integration](#integration)

## Techstack

- `Typescript`
- `Express`
- `PostgreSQL`
- `Prisma`
- `Jest`
- `Supertest`

## Prerequisities

- `node`
- `postgresql db created (pgadmin recommended)`

## To run

### Clone repository

```
git clone https://github.com/wojciechszmelczerczyk/ts-express-swapi-middleware.git
```

### Navigate to project directory

```sh
cd /ts-express-swapi-middleware
```

### Install dependencies

```
npm i
```

### Synchronize db schema with prisma

```
npx prisma db push
```

### Run API

```
npm run start
```

## App architecture

Application implements REST style architecture. Client communicate with server.

<details>
<summary>
Server communicate with database and third party API i.e Star Wars API.
</summary>

<img src="./.github/img/arch.png">
</details>

## Database architecture

<details>
<summary>
Film list has an id, name, film array and distinct characters array.
</summary>

[![](https://mermaid.ink/img/pako:eNqFz7EOgjAQgOFXaW4mPEA3ghhJcAHGLhd6SqNtTWkHQ_vuVoOGzZv-5L7hboXJSgIO5A4Krw61MOw3x7Y7sxTLMsZPd-0wMs5mXPaqPlV9VY9N_5_umzEoQJPTqGQ-YH3vBPiZNAngOSW6mwBhUnbhIdFTI5W3DvgF7wsVgMHb4Wkm4N4F-qLtj02lF4UxQjk)](https://mermaid.live/edit#pako:eNqFz7EOgjAQgOFXaW4mPEA3ghhJcAHGLhd6SqNtTWkHQ_vuVoOGzZv-5L7hboXJSgIO5A4Krw61MOw3x7Y7sxTLMsZPd-0wMs5mXPaqPlV9VY9N_5_umzEoQJPTqGQ-YH3vBPiZNAngOSW6mwBhUnbhIdFTI5W3DvgF7wsVgMHb4Wkm4N4F-qLtj02lF4UxQjk)

</details>

## Env setup

Create `.env` in project root directory

```
DB_URL=your-postgres-url

PORT=3000

BASE_FILMS_URL=https://swapi.dev/api/films

XLSX_FILE_NAME=someFileName.xlsx
```

## Postman file

Import this file [postman collection](/imoli.postman_collection.json) in Postman in order to explore API.

## API

| Endpoint |                       Method                       |
| :------: | :------------------------------------------------: |
|   GET    |           [`/films`](./docs/getFilms.md)           |
|   GET    |       [`/films/:id`](./docs/getFilmById.md)        |
|   POST   |           [`/favorites`](./docs/post.md)           |
|   GET    |       [`/favorites`](./docs/getFavorites.md)       |
|   GET    |   [`/favorites/:id`](./docs/getFavoriteById.md)    |
|   GET    | [`/favorites/:id/file`](./docs/getFileFavorite.md) |

## Tests

### To run:

`Unit tests`

```
npm run test-unit
```

`Integration/API tests`

```
npm run test-api
```

`Both`

```
npm run test
```

### Hooks

`Create new List table`

Before tests one Film list table is created.

```javascript
export const createDB = async (name: string) =>
  await prisma.filmList.create({
    data: {
      name,
    },
  });
```

`Flush all tables`

Before and after tests all tables are flushed.

```javascript
export const flushDBs = async () => {
  await prisma.character.deleteMany({});
  await prisma.film.deleteMany({});
  await prisma.filmList.deleteMany({});
};
```

`Refresh sequences on id's`

Before and after tests launch sequences are restarted.

```javascript
export const resetSequence = async () => {
  await prisma.$executeRaw`ALTER SEQUENCE "Character_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Film_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "FilmList_id_seq" RESTART WITH 1;`;
};
```

### Unit

`FilmService -> getFilms()`

<details>
<summary>return all films</summary>

```javascript
test("when id is not provided return all films", async () => {
  const { data } = await getFilmsService();
  expect(data.results.length).toBe(6);
});
```

</details>
<br/>

### Integration

`GET /films`

<details>
<summary>when id is not provided return all films</summary>

```javascript
test("when id is not provided return all films", async () => {
  const res = await request(app).get("/films");

  expect(res.status).toBe(200);
  expect(res.body).toBeTruthy();
});
```

</details>
<br/>

`GET /films/id`

<details>
<summary>when provided id is valid return specific film</summary>

```javascript
test("when id is provided return specific film", async () => {
  const id = 2;
  const res = await request(app).get(`/films/${id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeTruthy();
});
```

</details>

<details>
<summary>when provided id is not a numeric value, return error message</summary>

```javascript
test("when provided id is not a numeric value, return error message", async () => {
  const id = "id";
  const res = await request(app).get(`/films/${id}`);

  expect(res.status).toBe(404);
  expect(res.body.err).toBe("id has to be number");
});
```

</details>

<details>
<summary>when film with provided id doesn't exist, return error message</summary>

```javascript
test("when film with provided id doesn't exist, return error message", async () => {
  const id = 7;
  const res = await request(app).get(`/films/${id}`);

  expect(res.status).toBe(404);
  expect(res.body.err).toBe("film with this id doesn't exist");
});
```

</details>

<br/>

`POST /favorites`

<details>
<summary>when list with provided name exist and film id is correct, add film with provided id to list</summary>

```javascript
test("when list with provided name exist and film id is correct, add film with provided id to list", async () => {
  let listName = "Old Saga";

  let id = "2";

  const res = await request(app)
    .post("/favorites")
    .send({ id, name: listName });

  expect(res).toBeTruthy();
});
```

</details>

<details>
<summary>when list with provided name doesn't exist and film id is correct, create new list and add film with provided id to it</summary>

```javascript
test("when list with provided name doesn't exist and film id is correct, create new list and add film with provided id to it", async () => {
  let listName = "New Saga";

  let id = "2";

  const res = await request(app)
    .post("/favorites")
    .send({ id, name: listName });

  expect(res).toBeTruthy();
});
```

</details>
<details>
<summary>when film with provided id doesn't exist, return error</summary>

```javascript
test("when film with provided id doesn't exist, return error", async () => {
  let listName = "New Saga";

  let id = "7";

  const res = await request(app)
    .post("/favorites")
    .send({ id, name: listName });

  expect(res.body.err).toBe("film with this id doesn't exist");
});
```

</details>

<details>
<summary>when provided id is not a numeric value, return error</summary>

```javascript
test("when provided id is not a numeric value, return error", async () => {
  let listName = "New Saga";

  let id = "ss";

  const res = await request(app)
    .post("/favorites")
    .send({ id, name: listName });

  expect(res.body.err).toBe("id has to be number");
});
```

</details>

<details>
<summary>when added film with provided id already exist in list, return duplicate error</summary>

```javascript
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
```

</details>

<br/>

`GET /favorites`

<details>
<summary>when name query is not provided, return all lists</summary>

```javascript
test("when name query is not provided, return all lists", async () => {
  const res = await request(app).get("/favorites");

  // number of list tables added each time tests launch
  expect(res.body.length).toBe(8);
});
```

</details>

<details>
<summary>when name query is provided, return list by name</summary>

```javascript
test("when query name is provided, return list by name", async () => {
  const name = "New Saga";
  const res = await request(app).get("/favorites").query({ name });

  expect(res.body.name).toBe(name);
});
```

</details>

<details>
<summary>when page query is provided, return paginated lists by default 5</summary>

```javascript
test("when page query is provided, return paginated lists by default 5", async () => {
  const page = 1;
  const res = await request(app).get("/favorites").query({ page });
  expect(res.body.length).toBe(5);
});
```

</details>

<details>
<summary>when query page is not a numeric value, return error</summary>

```javascript
test("when query page is not a numeric value, return error", async () => {
  const page = "x";
  const res = await request(app).get("/favorites").query({ page });
  expect(res.body.err).toBe("Provided page value is not a number");
});
```

</details>

<details>
<summary>when limit query is provided, return specified number of lists</summary>

```javascript
test("when limit query is provided, return specified number of lists", async () => {
  const page = 2;
  const limit = 3;
  const res = await request(app).get("/favorites").query({ page, limit });
  expect(res.body.length).toBe(3);
});
```

</details>

<br />

`GET /favorites/:id`

<details>
<summary>when provided id is correct, return specific list with correlated films</summary>

```javascript
test("when provided id is correct, return specific list with correlated films", async () => {
  // New Saga list id
  const id = 8;

  const res = await request(app).get(`/favorites/${id}`);

  expect(res.body.name).toBe("New Saga");
});
```

</details>

<details>
<summary>when provided id is not a number value, return error message</summary>

```javascript
test("when provided id is not a number value, return error message", async () => {
  const id = "ss";
  const res = await request(app).get(`/favorites/${id}`);
  expect(res.body.err).toBe("Provided id has to be a number.");
});
```

</details>

<br />

`GET /favorites/:id/file`

<details>
<summary>when provided id is correct, download .xlsx file with list of characters</summary>

```javascript
test("when provided id is correct, download .xlsx file with list of characters", async () => {
  const id = 2;

  const res = await request(app).get(`/favorites/${id}/file`);

  expect(res.headers["content-type"]).toBe(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
});
```

</details>
