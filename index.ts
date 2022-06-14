import * as dotenv from "dotenv";
import express from "express";
import axios from "axios";
import { pick, map } from "lodash";

// env
dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());

app.get("/films", async (req, res) => {
  const { data } = await axios.get("https://swapi.dev/api/films");

  const { results } = data;

  const films = map(results, (i) => pick(i, "title", "release_date", "url"));

  res.json(films);
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
