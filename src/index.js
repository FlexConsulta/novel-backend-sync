import "dotenv/config";
import express from "express";
import { clearOldLogs } from "./services/clearOldLogs";
import { syncAllDatabase } from "./services/syncdatabase";
import { syncOneDatabase } from "./services/syncOneDatabase";

const { PORT, HOST } = process.env;

const app = express();

app.post("/refresh", async (req, res) => {
  await syncAllDatabase(false);
  res.send("sincronizado").status(200);
});

app.get("/test-connection", async (req, res, next) => {
  const { id_database } = req.query;
  const newLog = await syncOneDatabase(id_database);
  res.send(newLog).status(200);
});

app.listen(PORT, () => {
  syncAllDatabase(true);
  clearOldLogs();
  console.log(`O servidor está online: [${HOST}:${PORT}]`);
});
