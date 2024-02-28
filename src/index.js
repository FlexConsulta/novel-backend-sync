import "dotenv/config";
import express from "express";
import { clearOldLogs } from "./services/clearOldLogs";
import { syncAllDatabase } from "./services/syncdatabase";
import { syncOneDatabase } from "./services/syncOneDatabase";
import schedule from 'node-schedule';

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

app.listen(PORT, async () => {

  let syncOn = false
  await syncAllDatabase(true);

  schedule.scheduleJob(process.env.TIME_SCHEDULE, async function () {

    if (!syncOn) {
      console.log('INICIO CRON IMPORT DATABASE!');
      syncOn = true
      await syncAllDatabase(true);
      await clearOldLogs();
      syncOn = false
    }

  });

  console.log(`O servidor está online: [${HOST}:${PORT}]`);

});
