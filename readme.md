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

| Endpoint      | Method | Action                                                    |
| :------------ | :----: | :-------------------------------------------------------- |
| `/films/:id?` |  GET   | Get all films, when parameter provided, get specific film |
| `/favorites`  |  POST  | Add film to created list in db                            |

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

Response

```JSON
[
    {
        "id": "1",
        "title": "A New Hope",
        "release_date": "1977-05-25"
    },
    {
        "id": "2",
        "title": "The Empire Strikes Back",
        "release_date": "1980-05-17"
    },
    {
        "id": "3",
        "title": "Return of the Jedi",
        "release_date": "1983-05-25"
    },
    {
        "id": "4",
        "title": "The Phantom Menace",
        "release_date": "1999-05-19"
    },
    {
        "id": "5",
        "title": "Attack of the Clones",
        "release_date": "2002-05-16"
    },
    {
        "id": "6",
        "title": "Revenge of the Sith",
        "release_date": "2005-05-19"
    }
]
```

</details>

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

### Response

```JSON
{
  "id": "2",
  "title": "The Empire Strikes Back",
  "release_date": "1980-05-17"
}
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

### Response

```JSON
{
    "fail": true,
    "err": "id has to be number"
}
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

### Response

```JSON
{
    "fail": true,
    "err": "film with this id doesn't exist"
}
```

</details>
