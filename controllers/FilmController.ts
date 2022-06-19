import { map, chain } from "lodash";
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
  getFilmByIdService,
  getAllListsService,
  getListByIdService,
} from "../services/FilmService";
import axios from "axios";

export const getFilms = async (req: Request, res: Response) => {
  try {
    // fetch all films from swapi third party api
    const { data } = await getFilmsService();

    // destucture info about movies
    const { results } = data;

    // use ajv to validate json schema
    if (!validateFilms(results)) throw new Error("JSON schema is not valid");

    // pick needed properties from film, use helper function in order to extract url like so "https:swapi.dev/api/characters/2" => "2"
    const films = map(results, (film) => {
      return chain(film)
        .update("url", extractIdFromURL)
        .pick("url", "title", "release_date");
    });

    // send processed list of all films
    res.status(200).json(films);
  } catch (err) {
    if (err.message.includes("404"))
      err.message = "film with this id doesn't exist";
    return res.status(404).json({
      fail: true,
      err: err.message,
    });
  }
};

export const getFilmById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // if id is not a numeric value, throw an error
    if (isNaN(parseInt(id))) throw new Error("id has to be number");

    // otherwise get data about specific movie
    const { data } = await getFilmByIdService(id);

    // validate json schema structure
    if (!validateFilm(data)) throw new Error("JSON schema is not valid");

    // filter needed film data TODO: change property name from url to id
    const film = chain(data)
      .pick("url", "title", "release_date")
      .update("url", extractIdFromURL);

    // return single film
    res.status(200).json(film);
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
    // id of film, list name
    const { id, name } = req.body;

    // if provided id is not numeric, throw error
    if (isNaN(parseInt(id))) throw new Error("id has to be number");

    // get film by id
    const { data } = await getFilmByIdService(id as string);

    // validate json schema structure
    if (!validateFilm(data)) throw new Error("JSON schema is not valid");

    // get all character urls from film
    const characterUrls = data.characters;

    // get all characters names
    const characters = await Promise.all(
      characterUrls.map(async (url) => {
        const { data } = await axios.get(url);
        return data.name;
      })
    );

    // filter needed film data, exchange characters array of urls with actual character names
    const film = chain(data)
      .pick("title", "release_date", "characters")
      .set("characters", characters);

    // check if list with provided name already exists
    const list = await findFilmListService(name);

    // if not create new list
    if (list === null) {
      // create new list in db, add film to it
      const filmList = await addFilmService(name, film);

      // return list and film which was added to list
      res.json({ filmList, film });

      // otherwise add film to existing list
    } else {
      // update list with new film
      const filmList = await updateFilmService(name, film);

      // return list and film which was added to list
      res.json({ filmList, film });
    }
  } catch (err) {
    if (err.message.includes("404"))
      err.message = "film with this id doesn't exist";
    else if (err.message.includes("Unique constraint failed"))
      err.message =
        "film duplication error. Film with this id already exist in list";
    return res.status(404).json({
      fail: true,
      err: err.message,
    });
  }
};

export const getAllLists = async (req: Request, res: Response) => {
  try {
    // intercept name from query string
    const { name, page, limit } = req.query;

    // by default limit is 5
    const parsedLimit = parseInt(limit as string) || 5;

    // get list/s from db
    const list = await getAllListsService(name, page, parsedLimit);

    res.json(list);
  } catch (err) {
    return res.json({
      fail: true,
      err: err.message,
    });
  }
};

export const getListById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);

    const listById = await getListByIdService(parsedId);

    res.json(listById);
  } catch (err) {
    return res.json({
      fail: true,
      err: err.message,
    });
  }
};
