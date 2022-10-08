import "dotenv/config";
import express from "express";
import { syncAllDatabase } from "./services/syncdatabase";

const { PORT, HOST } = process.env;

const app = express();

syncAllDatabase(true);

app.listen(PORT, () => {
  console.log(`O servidor está online: [${HOST}:${PORT}]`);
});
