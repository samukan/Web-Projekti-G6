// src/controllers/authController.ts

import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
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
    const [rows] = await db.query<UserRow[]>(
      'SELECT user_id, role_id, email, password FROM Users WHERE email = ?',
      [email]
    );
    const user = rows[0]; // Otetaan ensimmäinen löytynyt käyttäjä ja toivotaan, että se on oikea

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
      {userId: user.user_id, role: user.role_id},
      process.env.JWT_SECRET as string,
      {expiresIn: '24h'}
    );

    res.json({token, message: 'Login successful'});
  } catch (error) {
    next(error); // Heitetään virheet Expressin error handlerille – ei pidetä taikavoimia virheiden hallinnassa
  }
};
