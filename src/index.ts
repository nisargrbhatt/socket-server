import { createServer } from "http";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Server, Socket } from "socket.io";
import { connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import v1Router from "./routes";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatService } from "./services";

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
app.use(express.json());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(helmet());

app.use("/api/v1", v1Router);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const chatService = new ChatService();

let userConnected = new Set<string>();

io.on(
  "connection",
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.info("Someone connected");

    //* When someone joins the room
    socket.on("join-room", (roomId: string, userId: string) => {
      socket.join(roomId);
      userConnected.add(userId);
      io.to(roomId).emit("user-connected", ...userConnected);

      //* When someone emits new message
      socket.on("message", (senderId, receiverId, message) => {
        chatService
          .create({
            senderId,
            receiverId,
            message,
            roomId,
          })
          .then((createdChat) => {
            console.log("Chat added successfully");
            io.to(roomId).emit("new-message", createdChat.toJSON());
          })
          .catch((error) => {
            console.error(error);
          });
      });

      //* Typing started
      socket.on("typing-start", () => {
        io.to(roomId).emit("user-typing-start", userId);
      });

      //* Typing stopped
      socket.on("typing-stop", () => {
        io.to(roomId).emit("user-typing-stop", userId);
      });

      //* Read receipt
      socket.on("message-read", (chatId) => {
        chatService
          .update(
            {
              read: true,
            },
            chatId
          )
          .then(() => {
            io.to(roomId).emit("user-message-read", chatId);
          })
          .catch((error) => {
            console.error(error);
          });
      });

      //* Leave the room
      socket.on("disconnect-user", () => {
        io.to(roomId).emit("user-disconnect", roomId, userId);
        userConnected.delete(userId);
        socket.leave(roomId);
      });
    });
  }
);

const port: number = Number(process.env.PORT) || 3000;

httpServer.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
