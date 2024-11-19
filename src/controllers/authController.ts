// src/controllers/authController.ts
// Tämä tiedosto käsittelee käyttäjän kirjautumista

import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt'; // Salasanojen "suolaus". Koska raw passwordit on niin 2010.
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import {RowDataPacket} from 'mysql2';

// Käyttäjän tiedot haetaan tietokannasta. Typetämme rivit, ettei TS heitä herneitä.
interface UserRow extends RowDataPacket {
  user_id: number;
  role_id: number; // Admin vai perusjäbä? 1 = Admin
  email: string;
  password: string;
}

// tarkistaa emailin, salasanan ja antaa tokenin
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password} = req.body;

    // Haetaan käyttäjä tietokannasta emailin perusteella.
    const [rows] = await db.query<UserRow[]>(
      'SELECT user_id, role_id, email, password FROM Users WHERE email = ?',
      [email]
    );
    const user = rows[0]; // Valitaan eka rivi, koska email on UNIQUE.

    if (!user) {
      res.status(401).json({message: 'Invalid email or password'});
      return;
    }

    // Tarkistetaan salasana
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
    next(error); //  lähetetään virhe handlerille jos joku menee pieleen
  }
};
