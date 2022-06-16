import { config } from "dotenv";
import axios from "axios";
import prisma from "../prisma/client";
import { ObjectChain } from "lodash";
import { ParsedQs } from "qs";
config();

type Film = {
  id: number;
  title: string;
  release_date: string;
  characters: string[];
};

type FilmList = {
  id: number;
  name: string;
};

type properties = "title" | "release_date" | "characters";

type queryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export const getFilmsService = async () =>
  await axios.get(`${process.env.BASE_FILMS_URL}`);

export const getFilmByIdService = async (id: string) =>
  await axios.get(`${process.env.BASE_FILMS_URL}/${id}`);

export const addFilmService = async (
  name: string,
  film: ObjectChain<Pick<Film, properties>>
): Promise<FilmList> => {
  return await prisma.filmList.create({
    data: {
      name,
      films: {
        create: [film.value()],
      },
    },
  });
};

export const updateFilmService = async (
  name: string,
  film: ObjectChain<Pick<Film, properties>>
): Promise<FilmList> => {
  return await prisma.filmList.update({
    where: {
      name: name,
    },
    data: {
      films: {
        create: [film.value()],
      },
    },
  });
};

export const findFilmListService = async (
  name: string
): Promise<FilmList | null> => {
  return await prisma.filmList.findUnique({
    where: {
      name: name,
    },
  });
};

export const getAllListsService = async (name: queryType) => {
  // if query
  if (name === undefined) {
    return await prisma.filmList.findMany();
  }
  return await prisma.filmList.findUnique({
    where: {
      name: name as string,
    },
  });
};
