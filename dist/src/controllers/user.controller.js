"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.login = exports.signup = void 0;
const bcrypt_1 = require("bcrypt");
const services_1 = require("../services");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userService = new services_1.UserService();
const signup = async (req, res, next) => {
    let user;
    try {
        user = await userService.getByEmail(req.body?.email);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    if (user) {
        return res.status(400).json({
            message: "User already registered",
        });
    }
    const password = (0, bcrypt_1.hashSync)(req.body.password, 10);
    let registeredUser;
    try {
        registeredUser = await userService.create({
            name: req.body.name,
            email: req.body.email,
            password: password,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    if (!registeredUser) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }
    return res.status(201).json({
        message: "User registered successfully",
    });
};
exports.signup = signup;
const login = async (req, res, next) => {
    let user;
    try {
        user = await userService.getByEmail(req.body?.email);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    if (!user) {
        return res.status(400).json({
            message: "Wrong credentials",
        });
    }
    const passwordCheck = (0, bcrypt_1.compareSync)(req.body.password, user.password);
    if (!passwordCheck) {
        return res.status(400).json({
            message: "Wrong credentials",
        });
    }
    const token = (0, jsonwebtoken_1.sign)({
        email: user.email,
        userId: user._id.toString(),
    }, `${process.env.JWT_KEY}`, {
        expiresIn: "24h",
    });
    return res.status(200).json({
        token: token,
        expiresIn: 24 * 60 * 60,
        userId: user._id.toString(),
        user: {
            ...user.toJSON(),
            password: undefined,
        },
    });
};
exports.login = login;
const users = async (req, res, next) => {
    let users;
    try {
        users = await userService.list();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    let mappedUsers = users.map((user) => ({
        ...user.toJSON(),
        password: undefined,
    }));
    return res.status(200).json({
        message: "Users fetched successfully",
        users: mappedUsers,
    });
};
exports.users = users;
