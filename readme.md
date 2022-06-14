# Swapi Middleware

## Description

Simple movies middleware

## Table of content

- [Techstack](#techstack)
- [Preqrequisities](#preqrequisities)
- [To run](#to-run)
- [Env setup](#env-setup)
- [API](#api)

## Techstack

- `Typescript`
- `Express`
- `PostgreSQL`
- `Prisma`

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
