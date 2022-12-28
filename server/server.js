import "dotenv/config";
import express from "express";
import wakeDyno from "woke-dyno";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import apiRouter from "./api/router.js";
import { API_SERVER_PORT } from "../vite.config.js";

const SELF_URL = "https://crystal-cove.onrender.com";
const PROD_MODE = process.env.PROD_MODE === "true";
const STATIC_FOLDER = PROD_MODE ? "../build/" : "../";
const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(dirName, STATIC_FOLDER);
app.use(express.static(staticPath));

app.use("/api", apiRouter);

app.listen(API_SERVER_PORT, () => {
  console.log(`Express app listening on port ${API_SERVER_PORT}`);
  const offset = 8; // LA
  const getOffsetHours = hours => (hours + offset) > 24 ? 24 - (hours + offset) : hours + offset;
  const napStartHour = getOffsetHours(18);
  const napEndHour = getOffsetHours(8)
  wakeDyno({
    url: SELF_URL,
    interval: 1000 * 60 * 14, // 14 minutes 
    startNap: [napStartHour, 0, 0, 0],
    endNap: [napEndHour, 0, 0, 0]
  }).start();
});


export default app;
