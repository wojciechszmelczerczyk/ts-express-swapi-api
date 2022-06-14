import { config } from "dotenv";
import axios from "axios";

config();

export const getFilmsService = async (id?: String) => {
  if (id) await axios.get(`${process.env.BASE_FILMS_URL}/${id}`);

  return await axios.get(`${process.env.BASE_FILMS_URL}`);
};
