// src/controllers/menuController.ts

import {Request, Response, NextFunction} from 'express';
import pool from '../utils/db';
import {RowDataPacket} from 'mysql2';

// Ruokalistan kohteen rajapinta
interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  popular: boolean;
}

// Hae kaikki ruokalistan kohteet
export const getMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM MenuItems');
    const menuItems: MenuItem[] = (rows as RowDataPacket[]).map(
      (row: RowDataPacket) => ({
        item_id: row['item_id'] as number,
        name: row['name'] as string,
        description: row['description'] as string,
        price: parseFloat(row['price'] as string),
        category: row['category'] as string,
        image_url: row['image_url'] as string,
        popular: Boolean(row['popular']), // Muunnetaan numero booleaniksi
      })
    );
    res.json(menuItems);
  } catch (error) {
    console.error('Virhe haettaessa ruokalistan kohteita:', error);
    next(error);
  }
};

// Hae yksittäinen ruokalistan kohde
export const getMenuItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params;

    if (!id) {
      res.status(400).json({message: 'Tuote-id puuttuu.'});
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM MenuItems WHERE item_id = ?',
      [id]
    );
    const menuItems: MenuItem[] = (rows as RowDataPacket[]).map(
      (row: RowDataPacket) => ({
        item_id: row['item_id'] as number,
        name: row['name'] as string,
        description: row['description'] as string,
        price: parseFloat(row['price'] as string),
        category: row['category'] as string,
        image_url: row['image_url'] as string,
        popular: Boolean(row['popular']), // Muunnetaan numero booleaniksi
      })
    );

    if (menuItems.length === 0) {
      res.status(404).json({message: 'Ruokalistan kohdetta ei löytynyt.'});
      return;
    }

    res.json(menuItems[0]);
  } catch (error) {
    console.error('Virhe haettaessa yksittäistä ruokalistan kohdetta:', error);
    next(error);
  }
};

// Lisää uusi ruokalistan kohde
export const addMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {name, description, price, category, image_url, popular} = req.body;

    // Varmistetaan, että pakolliset kentät ovat olemassa
    if (!name || price === undefined) {
      res.status(400).json({message: 'Nimi ja hinta ovat pakollisia.'});
      return;
    }

    // Lisää uusi ruokalistan kohde tietokantaan
    const [result] = await pool.query(
      'INSERT INTO MenuItems (name, description, price, category, image_url, popular) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name,
        description,
        price,
        category,
        image_url,
        popular ? 1 : 0, // Muutetaan boolean arvo numeroksi
      ]
    );

    const insertedId = (result as any).insertId;

    res
      .status(201)
      .json({message: 'Ruokalistan kohde lisätty.', item_id: insertedId});
  } catch (error) {
    console.error('Virhe lisättäessä ruokalistan kohdetta:', error);
    next(error);
  }
};

// Päivitä olemassa oleva ruokalistan kohde
export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params;
    const {name, description, price, category, image_url, popular} = req.body;

    // Varmistetaan, että tuote-id on annettu
    if (!id) {
      res.status(400).json({message: 'Tuote-id puuttuu.'});
      return;
    }

    // Päivitä ruokalistan kohteen tiedot
    const [result] = await pool.query(
      'UPDATE MenuItems SET name = ?, description = ?, price = ?, category = ?, image_url = ?, popular = ? WHERE item_id = ?',
      [
        name,
        description,
        price,
        category,
        image_url || null, // Salli null-arvo, jos kuvaa ei päivitetä
        popular ? 1 : 0, // Muutetaan boolean arvo numeroksi
        id,
      ]
    );

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({message: 'Ruokalistan kohdetta ei löytynyt.'});
      return;
    }

    res.json({message: 'Ruokalistan kohteen tiedot päivitetty.'});
  } catch (error) {
    console.error('Virhe päivittäessä ruokalistan kohdetta:', error);
    next(error);
  }
};

// Poista ruokalistan kohde
export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params;

    // Varmistetaan, että tuote-id on annettu
    if (!id) {
      res.status(400).json({message: 'Tuote-id puuttuu.'});
      return;
    }

    // Poista ruokalistan kohde
    const [result] = await pool.query(
      'DELETE FROM MenuItems WHERE item_id = ?',
      [id]
    );
    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({message: 'Ruokalistan kohdetta ei löytynyt.'});
      return;
    }

    res.json({message: 'Ruokalistan kohde poistettu.'});
  } catch (error) {
    console.error('Virhe poistaessa ruokalistan kohdetta:', error);
    next(error);
  }
};
