import "dotenv/config";
import express from "express";
import winston from "winston";
import "../startup/log.js";
import { routes } from "../startup/routes.js";
import { db } from "../startup/db.js";
import { jwt } from "../startup/jwt.js";
import setupProd from "../startup/prod.js";

const app = new express();

setupProd(app);
routes(app);

async function main() {
  await db();
  jwt();
}

main().catch((err) => {
  winston.error("App init error:", err);
});

app.set("view engine", "pug");

export default app;
// const PORT = process.env.PORT || 8001;
// export const server = app.listen(PORT, () =>
//     winston.info(`Server running on http://localhost:${PORT}`)
// );
