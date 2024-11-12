import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tarkista JWT-token
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tarkista, että käyttäjä on admin
};
