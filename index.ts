import dotenv from "dotenv";
import server from "./utils/createServer";

dotenv.config();

const app = server();

const port: number = parseInt(process.env.PORT as string, 10);

app.listen(port, () => console.log(`Listening on port: ${port}`));
