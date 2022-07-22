import { createServer } from "http";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import { connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import v1Router from "./routes";

dotenv.config();

const app: Application = express();

const httpServer = createServer(app);

connect(
  `${process?.env?.MONGO_HOST}${encodeURIComponent(
    process?.env?.MONGO_USER ?? "test"
  )}:${encodeURIComponent(process?.env?.MONGO_PASS ?? "password")}${
    process.env?.MONGO_DOMAIN
  }${process.env?.MONGO_DATABASE_NAME}` ||
    "mongodb://127.0.0.1:27017/socket_server",
  {
    retryWrites: true,
  }
)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(cors());

app.use(morgan("dev"));

app.use(helmet());

app.use("api/v1/", v1Router);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port: number = Number(process.env.PORT) || 3000;

httpServer.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
