import { Router } from "express";
import {
  getFilms,
  getFilmById,
  addFilm,
  getAllLists,
  getListById,
} from "../controllers/FilmController";

const router = Router();

router.get("/films", getFilms);

router.get("/films/:id", getFilmById);

router.route("/favorites").get(getAllLists).post(addFilm);

router.get("/favorites/:id", getListById);

export default router;
