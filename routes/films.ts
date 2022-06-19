import { Router } from "express";
import {
  getFilms,
  getFilmById,
  addFilm,
  getAllLists,
  getListById,
  exportSpecificListToExcel,
} from "../controllers/FilmController";

const router = Router();

router.get("/films", getFilms);

router.get("/films/:id", getFilmById);

router.route("/favorites").get(getAllLists).post(addFilm);

router.get("/favorites/:id", getListById);

router.get("/favorites/:id/file", exportSpecificListToExcel);

export default router;
