import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import apiRouter from "./api/router.js";
import { API_SERVER_PORT } from "../vite.config.js";

console.log("process.env.PROD_MODE:", process.env.PROD_MODE);
const PROD_MODE = process.env.PROD_MODE === "true";
const STATIC_FOLDER = PROD_MODE ? "../build/" : "../";
const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(dirName, STATIC_FOLDER);
console.log("staticPath:", staticPath);
// app.use("*", (req, res, next) => {
//   console.log("req:", req.url);
//   return next();
// })
app.use(express.static(staticPath));

app.use("/api", apiRouter);

// app.get("/*", (req, res, next) => {
//   // catch-all route
//   console.log("PROD_MODE:", PROD_MODE);
//   const clientPath = PROD_MODE ? "../build/index.html" : "../index.html";
//   const newPath = path.join(dirName, clientPath);
//   console.log("newPath:", newPath);
//   res.sendFile(newPath);
// });

app.listen(API_SERVER_PORT, () => {
  console.log(`Express app listening on port ${API_SERVER_PORT}`);
});

export default app;
