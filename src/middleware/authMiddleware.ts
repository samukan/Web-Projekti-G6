import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {userId: number; role: string};
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
        role: string;
      };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({message: 'Virheellinen token'});
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
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({message: 'Ei käyttöoikeutta'});
  }
};
