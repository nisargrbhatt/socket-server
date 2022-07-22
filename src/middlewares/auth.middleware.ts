import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Response } from "express";
dotenv.config();

const auth = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken: { email: string; userId: string } = verify(
      token,
      `${process.env.JWT_KEY}`
    ) as { email: string; userId: string };
    req.userData = { email: decodedToken?.email, userId: decodedToken?.userId };
    next();
  } catch (err) {
    res.status(401).json({
      message: "You are not authenticated!",
    });
  }
};

export default auth;
