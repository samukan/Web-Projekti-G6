// src/middleware/authMiddleware.ts

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {userId: number; role: number};
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        role: number;
      };
      req.user = decoded; // Lisää käyttäjätiedot pyyntöön
      next();
    } catch (error) {
      res.status(401).json({message: 'Virheellinen tai vanhentunut token'});
    }
  } else {
    res.status(401).json({message: 'Token puuttuu'});
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 1) {
    next(); // Käyttäjä on admin
  } else {
    res.status(403).json({message: 'Ei oikeuksia admin-sivuille'});
  }
};

export const authorizeDriver = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 3) {
    next();
  } else {
    res.status(403).json({message: 'Ei oikeuksia kuljettaja-sivuille'});
  }
};

export const authorizeAdminOrDriver = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && (req.user.role === 1 || req.user.role === 3)) {
    next();
  } else {
    res
      .status(403)
      .json({message: 'Ei oikeuksia tilauksen statuksen päivittämiseen'});
  }
};
