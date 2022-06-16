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
  await prisma.film.deleteMany({});
  await prisma.filmList.deleteMany({});
};
