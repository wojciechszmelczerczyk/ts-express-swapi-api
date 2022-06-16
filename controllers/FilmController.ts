import _ from "lodash";
import { Request, Response } from "express";

// schema validation
import { validateFilm, validateFilms } from "../api/schema/response";

// helper function
import extractIdFromURL from "../utils/extractIdFromURL";
import {
  getFilmsService,
  addFilmService,
  updateFilmService,
  findFilmListService,
} from "../services/FilmService";
import axios from "axios";

export const getFilms = async (req: Request, res: Response) => {
  // catch id parameter
  const id = req.params.id ? req.params.id : undefined;

  try {
    if (id !== undefined) {
      // if id is not a numeric value, throw an error
      if (isNaN(parseInt(id))) throw new Error("id has to be number");

      // otherwise get data about specific movie
      const { data } = await getFilmsService(id);

      // validate json schema structure
      if (!validateFilm(data)) throw new Error("JSON schema is not valid");

      // filter needed film data, update name of url property with id
      const film = _.chain(data)
        .pick("url", "title", "release_date")
        .update("url", extractIdFromURL);

      res.status(200).json(film);

      // if no id is provided get all films
    } else if (id === undefined) {
      // get data about all movies
      const { data } = await getFilmsService();

      // destucture info about movies
      const { results } = data;

      if (!validateFilms(results)) throw new Error("JSON schema is not valid");

      const films = _.map(results, (film) => {
        return _.chain(film)
          .update("url", extractIdFromURL)
          .pick("url", "title", "release_date");
      });

      res.status(200).json(films);
    }
  } catch (err) {
    if (err.message.includes("404"))
      err.message = "film with this id doesn't exist";
    return res.status(404).json({
      fail: true,
      err: err.message,
    });
  }
};

export const addFilm = async (req: Request, res: Response) => {
  try {
    // selected film id, name for new list
    const { id, name } = req.body;

    if (isNaN(parseInt(id))) throw new Error("id has to be number");

    // get film by id
    const { data } = await getFilmsService(id);

    // validate json schema structure
    if (!validateFilm(data)) throw new Error("JSON schema is not valid");

    // get all characters from film
    const characterUrls = data.characters;

    // get all characters names
    const characters = await Promise.all(
      characterUrls.map(async (url) => {
        const { data } = await axios.get(url);
        return data.name;
      })
    );

    // filter needed film data, update name of url property with id
    const film = _.chain(data)
      .pick("title", "release_date", "characters")
      .set("characters", characters);

    // check if list with provided name already exists
    const list = await findFilmListService(name);

    // if not create new list
    if (list === null) {
      const filmList = await addFilmService(name, film);
      // otherwise add film to existing list
      res.json({ filmList, film });
    } else {
      const filmList = await updateFilmService(name, film);
      res.json({ filmList, film });
    }
  } catch (err) {
    if (err.message.includes("404"))
      err.message = "film with this id doesn't exist";
    return res.status(404).json({
      fail: true,
      err: err.message,
    });
  }
};
