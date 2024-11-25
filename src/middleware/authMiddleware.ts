// src/middleware/authMiddleware.ts
// Tässä tiedostossa on toteutettu kaksi middlewarea, authenticateUser ja authorizeAdmin. authenticateUser tarkistaa,
// että pyynnön mukana tulee token ja että token on validi. authorizeAdmin tarkistaa, että käyttäjällä on admin-oikeudet.
// Jos käyttäjällä ei ole oikeuksia, palautetaan statuskoodi joka frontendissä käsitellään ja käyttäjä heitetään ulos.

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {userId: number; role: number};
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
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
