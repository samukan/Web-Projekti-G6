// src/controllers/authController.ts

import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import {RowDataPacket} from 'mysql2';

// Käyttäjän tyypin määrittely
interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  role: 'customer' | 'admin';
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {email, password, role} = req.body;

    // Tarkistetaan, että sähköposti ja salasana on annettu
    if (!email || !password) {
      res.status(400).json({message: 'Sähköposti ja salasana vaaditaan'});
      return;
    }

    // Tarkistetaan, ettei käyttäjä ole jo olemassa
    const [existingUser] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      res.status(400).json({message: 'Käyttäjä on jo olemassa'});
      return;
    }

    // Hashataan salasana (Tämä ei oikeiin toimi toistaiseksi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tallennetaan käyttäjä tietokantaan
    await pool.query(
      'INSERT INTO Users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role || 'customer']
    );

    res.status(201).json({message: 'Rekisteröityminen onnistui'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Palvelinvirhe', error});
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {email, password} = req.body;

    // Tarkistetaan, että sähköposti ja salasana on annettu
    if (!email || !password) {
      res.status(400).json({message: 'Sähköposti ja salasana vaaditaan'});
      return;
    }

    // Haetaan käyttäjä tietokannasta
    const [users] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    const user = users[0];

    if (!user) {
      res.status(401).json({message: 'Virheellinen sähköposti tai salasana'});
      return;
    }

    // Verrataan salasanoja
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({message: 'Virheellinen sähköposti tai salasana'});
      return;
    }

    // Luodaan JWT-token
    const token = jwt.sign(
      {userId: user.id, role: user.role},
      process.env.JWT_SECRET as string,
      {expiresIn: '1h'}
    );

    res.json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Palvelinvirhe', error});
  }
};
