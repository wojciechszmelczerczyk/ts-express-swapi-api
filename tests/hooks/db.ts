import prisma from "../../prisma/client";

// create db
export const createDB = async (name: string) =>
  await prisma.filmList.create({
    data: {
      name,
    },
  });

// flush dbs
export const flushDBs = async () => {
  await prisma.character.deleteMany({});
  await prisma.film.deleteMany({});
  await prisma.filmList.deleteMany({});
};

// reset sequences on id's
export const resetSequence = async () => {
  await prisma.$executeRaw`ALTER SEQUENCE "Character_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Film_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "FilmList_id_seq" RESTART WITH 1;`;
};
