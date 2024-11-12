// src/controllers/authController.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../utils/db";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Tarkista, että sähköposti ja salasana on annettu
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Sähköposti ja salasana vaaditaan" });
    }

    // Tarkista, onko käyttäjä jo olemassa
    const [rows] = await pool.execute("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length > 0) {
      return res.status(400).json({ message: "Sähköposti on jo käytössä" });
    }

    // Hashaa salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lisää käyttäjä tietokantaan
    await pool.execute(
      "INSERT INTO Users (role_id, email, password) VALUES (?, ?, ?)",
      [
        2, // Oletetaan, että rooli 2 on 'Asiakas'
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({ message: "Rekisteröityminen onnistui" });
  } catch (error) {
    res.status(500).json({ message: "Palvelinvirhe", error });
  }
};
