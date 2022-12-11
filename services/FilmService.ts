import { config } from "dotenv";
import axios from "axios";
import prisma from "../prisma/client";
import { isString, ObjectChain, difference } from "lodash";
import { ParsedQs } from "qs";
import { Workbook } from "exceljs";
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

type queryType = string | string[] | number | ParsedQs | ParsedQs[] | undefined;

export const getFilmsService = async () =>
  await axios.get(`${process.env.BASE_FILMS_URL}`);

export const getFilmByIdService = async (id: string) =>
  await axios.get(`${process.env.BASE_FILMS_URL}/${id}`);

export const addFilmService = async (
  name: string,
  film: ObjectChain<Pick<Film, properties>>
): Promise<FilmList> => {
  const { title, release_date, characters } = film.value();
  return await prisma.filmList.create({
    data: {
      name,
      films: {
        create: [{ title, release_date }],
      },
      characters: {
        create: characters.map((character) => ({ name: character })),
      },
    },
  });
};

export const updateFilmService = async (
  name: string,
  film: ObjectChain<Pick<Film, properties>>
) => {
  const { title, release_date, characters } = film.value();

  // get characters from list db
  const [charactersFromDb] = await prisma.filmList.findMany({
    where: {
      name,
    },
    select: {
      characters: true,
    },
  });

  // names of characters from database
  const characterNames = charactersFromDb.characters.map(
    (character) => character.name
  );

  // A/B in order to return only new characters
  const distinctCharacters = difference(characters, characterNames);

  return await prisma.filmList.update({
    where: {
      name: name,
    },
    data: {
      films: {
        create: [{ title, release_date }],
      },
      characters: {
        create: distinctCharacters.map((character) => ({ name: character })),
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

export const getAllListsService = async (
  name: queryType,
  page: queryType,
  limit: number
) => {
  try {
    if (isString(page) && !parseInt(page))
      throw new Error("Provided page value is not a number");

    // calculate offset
    const offset = (parseInt(page as string) - 1) * limit;

    // if no query is provided, return all lists
    if (name === undefined && page === undefined) {
      return await prisma.filmList.findMany();
      // if page query is provided, paginate response
    } else if (page) {
      return await prisma.filmList.findMany({ skip: offset, take: limit });
    }
    // otherwise filter list by name
    return await prisma.filmList.findUnique({
      where: {
        name: name as string,
      },
    });
  } catch (err) {
    return {
      fail: true,
      err: err.message,
    };
  }
};

export const getListByIdService = async (id: queryType) => {
  if (!parseInt(id as string))
    throw new Error("Provided id has to be a number.");

  const list = await prisma.filmList.findUnique({
    where: {
      id: parseInt(id as string),
    },
    include: {
      films: true,
      characters: true,
    },
  });

  if (list === null) throw new Error("List with provided id not found");

  return list;
};

export const exportSpecificListToExcelService = async (id: queryType) => {
  try {
    if (!parseInt(id as string))
      throw new Error("Provided id has to be a number");

    // excel workbook
    const wb = new Workbook();

    // worksheet
    const worksheet = wb.addWorksheet("Characters");

    const listDetails = await prisma.filmList.findUnique({
      where: {
        id: parseInt(id as string),
      },
      include: {
        films: {
          select: {
            title: true,
          },
        },
        characters: {
          select: {
            name: true,
          },
        },
      },
    });

    // if list with provided id doesn't exist, return error message
    if (listDetails === null)
      throw new Error("List with provided id doesn't exist");

    const { characters } = listDetails;
    // add header
    worksheet.columns = [
      { header: "Characters", key: "characters", width: 30 },
      { header: "Films", key: "films", width: 30 },
    ];

    // iterate on list details, add characters and title to worksheet
    for (let i = 0; i < characters.length; i++) {
      worksheet.addRow({
        characters: characters[i].name,
      });
    }

    // filename
    const fileName = process.env.XLSX_FILE_NAME as string;

    // save file
    await wb.xlsx.writeFile(fileName);
  } catch (err) {
    return {
      fail: true,
      err: err.message,
    };
  }
};
