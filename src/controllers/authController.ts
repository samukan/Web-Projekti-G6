// src/controllers/authController.ts

import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import {RowDataPacket} from 'mysql2';

// Käyttäjän tietokantarivi koska käyttäjillä on salaisuuksia
interface UserRow extends RowDataPacket {
  user_id: number;
  role_id: number;
  email: string;
  password: string;
}

// Login-funktio – portinvartija sisäänkirjautumiseksi
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password} = req.body;

    // Hae käyttäjä sähköpostin perusteella
    const [rows] = await pool.query<UserRow[]>(
      'SELECT user_id, role_id, email, password FROM Users WHERE email = ?',
      [email]
    );
    const user = rows[0]; // Otetaan ensimmäinen löytynyt käyttäjä

    if (!user) {
      res.status(401).json({message: 'Invalid email or password'});
      return;
    }

    // Vahvista salasana
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({message: 'Invalid email or password'});
      return;
    }

    // Generoi JWT
    const token = jwt.sign(
      {userId: user.user_id, role: user.role_id}, // Sisältää userId ja role
      process.env.JWT_SECRET as string,
      {expiresIn: '24h'}
    );

    res.json({token, message: 'Login successful'});
  } catch (error) {
    next(error); // Heitetään virheet Expressin error handlerille
  }
};

// VerifyToken-funktio – tarkistaa tokenin ja palauttaa admin-tiedon
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: number;
        role: number;
      };

      res.json({isAdmin: decoded.role === 1});
    } else {
      res.status(401).json({message: 'Token puuttuu'});
    }
  } catch (error) {
    res.status(401).json({message: 'Virheellinen tai vanhentunut token'});
  }
};

// Rekisteröintifunktio – luo uuden käyttäjän
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password} = req.body;

    // Tarkista, onko sähköposti jo käytössä
    const [existingUsers] = await pool.query<UserRow[]>(
      'SELECT email FROM Users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({message: 'Sähköposti on jo rekisteröity.'});
      return;
    }

    // Hashaa salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lisää uusi käyttäjä tietokantaan
    await pool.execute(
      'INSERT INTO Users (email, password, role_id) VALUES (?, ?, ?)',
      [email, hashedPassword, 2] // Oletetaan, että rooli 2 on 'asiakas'
    );

    res.status(201).json({message: 'Rekisteröityminen onnistui!'});
  } catch (error) {
    next(error);
  }
};
