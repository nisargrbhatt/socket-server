"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const services_1 = require("./services");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
(0, mongoose_1.connect)(`${process?.env?.MONGO_HOST}${encodeURIComponent(process?.env?.MONGO_USER ?? "test")}:${encodeURIComponent(process?.env?.MONGO_PASS ?? "password")}${process.env?.MONGO_DOMAIN}${process.env?.MONGO_DATABASE_NAME}` ||
    "mongodb://127.0.0.1:27017/socket_server", {
    retryWrites: true,
})
    .then(() => {
    console.log("Database connected");
})
    .catch((error) => {
    console.error(error);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, helmet_1.default)());
app.use("/api/v1", routes_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const chatService = new services_1.ChatService();
let userConnected = new Set();
io.on("connection", (socket) => {
    console.info("Someone connected");
    //* When someone joins the room
    socket.on("join-room", (roomId, userId) => {
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
                .update({
                read: true,
            }, chatId)
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
});
app.use("*", (req, res, next) => {
    return res.status(400).json({
        message: "No route found",
    });
});
const port = Number(process.env.PORT) || 3000;
httpServer.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});
