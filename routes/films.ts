import { Router } from "express";
import { getFilms, getFilmById, addFilm } from "../controllers/FilmController";

const router = Router();

router.get("/films", getFilms);

router.get("/films/:id", getFilmById);

router.post("/favorites", addFilm);

export default router;
