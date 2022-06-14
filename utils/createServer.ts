// express
import express, { Express } from "express";
// routes
import films from "../routes/films";

const server = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(films);

  return app;
};

export default server;
