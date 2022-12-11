import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
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
  
  setInterval(() => {
    // keep server awake
    console.log(`Fetching ${SELF_URL} to wake up server`)
    fetch(SELF_URL)
      .then(() =>
        console.log("Server is awake")
      )
      .catch((error) => console.log(`Error fetching ${SELF_URL}: ${error.message}`));
  }, 1000 * 60 * 14);
});


export default app;
