import { config } from "dotenv";
import axios from "axios";
import prisma from "../prisma/client";

config();

export const getFilmsService = async (id?: String) => {
  if (id) return await axios.get(`${process.env.BASE_FILMS_URL}/${id}`);

  return await axios.get(`${process.env.BASE_FILMS_URL}`);
};

export const addFilmService = async (name, film) => {
  return await prisma.filmList.create({
    data: {
      name,
      films: {
        create: [film.value()],
      },
    },
  });
};

export const updateFilmService = async (name, film) => {
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

export const findFilmListService = async (name) => {
  return await prisma.filmList.findUnique({
    where: {
      name: name,
    },
  });
};
