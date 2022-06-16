import { Router } from "express";
import { getFilms, addFilm } from "../controllers/FilmController";

const router = Router();

router.get("/films/:id?", getFilms);

router.post("/favorites", addFilm);

export default router;
