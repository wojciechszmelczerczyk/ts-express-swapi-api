import { Router } from "express";
import {
  getFilms,
  getFilmById,
  addFilm,
  getAllLists,
} from "../controllers/FilmController";

const router = Router();

router.get("/films", getFilms);

router.get("/films/:id", getFilmById);

router.route("/favorites").get(getAllLists).post(addFilm);

export default router;
