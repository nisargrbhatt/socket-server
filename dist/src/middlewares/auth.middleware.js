"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = (0, jsonwebtoken_1.verify)(token, `${process.env.JWT_KEY}`);
        req.userData = { email: decodedToken?.email, userId: decodedToken?.userId };
        next();
    }
    catch (err) {
        res.status(401).json({
            message: "You are not authenticated!",
        });
    }
};
exports.default = auth;
