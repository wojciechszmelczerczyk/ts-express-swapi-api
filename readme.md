# Swapi Middleware

## Description

Simple movies middleware

## Table of content

- [Techstack](#techstack)
- [Preqrequisities](#preqrequisities)
- [To run](#to-run)
- [Env setup](#env-setup)
- [API](#api)
- [Tests](#tests)

  - [Unit](#unit)
  - [Integration](#integration)

## Techstack

- `Typescript`
- `Express`
- `PostgreSQL`
- `Prisma`
- `Jest`
- `Supertest`

## Preqrequisities

- `node`
- `postgresql`

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

### Run API

```
npm run start
```

## Env setup

### Create `.env` in project root directory

```
DB_URL=your-postgres-url

PORT=3000

BASE_FILMS_URL=https://swapi.dev/api/films
```

## API

| Endpoint | Method | Action           |
| :------- | :----: | :--------------- |
| `/films` |  GET   | Get all movies\* |

\* you can provide `id` parameter like so `/films/2` in order to get info about specific film.

## Tests

### To run:

```
npm run test
```

### Unit

`FilmService -> getFilms(id?)`

<details>
<summary>when id is not provided return all films</summary>

```javascript
test("when id is not provided return all films", async () => {
  const { data } = await getFilmsService();
  expect(data.results.length).toBe(6);
});
```

</details>

### Integration

`GET /films/id?`

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

<details>
<summary>when id is provided return specific film</summary>

```javascript
test("when id is provided return specific film", async () => {
  const id = 2;
  const res = await request(app).get(`/films/${id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeTruthy();
});
```

</details>
