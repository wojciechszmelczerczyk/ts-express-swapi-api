import * as dotenv from "dotenv";
import express from "express";
import axios from "axios";
import { pick, map } from "lodash";

// env
dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());

app.get("/films/:id?", async (req, res) => {
  if (req.params.id === undefined) {
    const { data } = await axios.get(`${process.env.BASE_FILMS_API}`);

    const { results } = data;

    const films = map(results, (i) => pick(i, "url", "title", "release_date"));

    res.json(films);
  } else {
    const { data } = await axios.get(
      `${process.env.BASE_FILMS_API}/${req.params.id}`
    );

    const film = pick(data, "url", "title", "release_date");

    res.json(film);
  }
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
