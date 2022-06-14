import { Router } from "express";
import { getFilms } from "../controllers/FilmController";

const router = Router();

router.get("/films/:id?", getFilms);

export default router;
