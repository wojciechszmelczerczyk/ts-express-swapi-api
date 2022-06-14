import _ from "lodash";
import { Request, Response } from "express";

// helper function
import extractIdFromURL from "../utils/extractIdFromURL";
import { getFilmsService } from "../services/getFilms";

export const getFilms = async (req: Request, res: Response) => {
  // catch id parameter
  const id = req.params.id ? req.params.id : undefined;

  // if no id is provided get all films
  if (id === undefined) {
    // get data about all movies
    const { data } = await getFilmsService();

    // destucture info about movies
    const { results } = data;

    // filter needed film data [{all properties}, {all properties}, ...] => [{url, title, release_date}, {url, title, release_date}, ...]
    const films = _.map(results, (film) => {
      return _.chain(film)
        .update("url", extractIdFromURL)
        .pick("url", "title", "release_date");
    });

    res.json(films);

    // otherwise get film by id
  } else {
    // get data about specific movie
    const { data } = await getFilmsService(id);

    // filter needed film data, update name of url property with id
    const film = _.chain(data)
      .pick("url", "title", "release_date")
      .update("url", extractIdFromURL);

    res.json(film);
  }
};
