import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();

interface Film {
  episode_id: number;
  url: string;
  opening_crawl: string;
  director: string;
  producer: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  title: string;
  release_date: string;
}

const FilmSchema: JSONSchemaType<Film> = {
  type: "object",
  properties: {
    url: { type: "string" },
    title: { type: "string" },
    release_date: { type: "string" },
    episode_id: { type: "integer" },
    opening_crawl: { type: "string" },
    director: { type: "string" },
    producer: { type: "string" },
    characters: { type: "array", items: { type: "string" } },
    planets: { type: "array", items: { type: "string" } },
    starships: { type: "array", items: { type: "string" } },
    vehicles: { type: "array", items: { type: "string" } },
    species: { type: "array", items: { type: "string" } },
    created: { type: "string" },
    edited: { type: "string" },
  },
  required: [
    "url",
    "title",
    "release_date",
    "episode_id",
    "opening_crawl",
    "director",
    "producer",
    "characters",
    "planets",
    "starships",
    "vehicles",
    "species",
    "created",
    "edited",
  ],
  additionalProperties: false,
};

const FilmsSchema: JSONSchemaType<Film[]> = {
  type: "array",
  items: FilmSchema,
};

const validateFilm = ajv.compile(FilmSchema);
const validateFilms = ajv.compile(FilmsSchema);

export { validateFilm, validateFilms };
