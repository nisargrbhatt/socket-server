import { Request, Response, NextFunction } from "express";
import { compareSync, hashSync } from "bcrypt";
import { IUser } from "../models";
import { UserService } from "../services";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userService = new UserService();

const signup = async (req: Request, res: Response, next: NextFunction) => {
  let user;
  try {
    user = await userService.getByEmail(req.body?.email);
  } catch (error) {
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

  const password = hashSync(req.body.password, 10);

  let registeredUser;
  try {
    registeredUser = await userService.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });
  } catch (error) {
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  let user;
  try {
    user = await userService.getByEmail(req.body?.email);
  } catch (error) {
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

  const passwordCheck = compareSync(req.body.password, user.password);

  if (!passwordCheck) {
    return res.status(400).json({
      message: "Wrong credentials",
    });
  }

  const token = sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    `${process.env.JWT_KEY}`,
    {
      expiresIn: "24h",
    }
  );

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

export { signup, login };
