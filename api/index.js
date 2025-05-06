import "dotenv/config";
import express from "express";
import winston from "winston";
import "../startup/log.js";
import { routes } from "../startup/routes.js";
import { db } from "../startup/db.js";
import { jwt } from "../startup/jwt.js";
import setupProd from "../startup/prod.js";
import process from "node:process";

const app = new express();

setupProd(app);
routes(app);

async function main() {
  try {
    await db();
    jwt();
  } catch (err) {
    winston.error("App init error:", err);
  }
}

main();

app.set("view engine", "pug");

const PORT = process.env.PORT || 8001;
export const server = app.listen(PORT, () =>
  winston.info(`Server running on http://localhost:${PORT}`)
);
