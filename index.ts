import express, { Express } from "express";
import config from "./src/config/config";
import { dataTransferRoutes, userRoutes } from "./src/routes";
import { ErrorMiddleware } from "./src/middlewares";
import cookieParser from "cookie-parser";
import cors from "cors"
import "./src/config/db";

const app: Express = express();
const { PORT, COOKIE_SECRET } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET))
app.use(cors())

app.use("/api/user", userRoutes);
app.use("/api/dataTransfer", dataTransferRoutes);
app.use(ErrorMiddleware);

app.listen(PORT, () => console.log("Server listening on port: " + PORT));
