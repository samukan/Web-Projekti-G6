// src/controllers/authController.ts

import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import {RowDataPacket} from 'mysql2';

interface UserRow extends RowDataPacket {
  user_id: number;
  role_id: number;
  email: string;
  password: string;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password} = req.body;

    // Fetch user by email
    const [rows] = await db.query<UserRow[]>(
      'SELECT user_id, role_id, email, password FROM Users WHERE email = ?',
      [email]
    );
    const user = rows[0]; // Extract the first user

    if (!user) {
      res.status(401).json({message: 'Invalid email or password'});
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({message: 'Invalid email or password'});
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      {userId: user.user_id, role: user.role_id},
      process.env.JWT_SECRET as string,
      {expiresIn: '24h'}
    );

    res.json({token, message: 'Login successful'});
  } catch (error) {
    next(error); // Pass unexpected errors to the Express error handler
  }
};
