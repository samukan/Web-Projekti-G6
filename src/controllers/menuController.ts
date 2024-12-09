// src/controllers/menuController.ts

/**
 * @api {get} /api/menu Get Menu Items
 * @apiName GetMenuItems
 * @apiGroup Menu Controller
 *
 * @apiSuccess {Object[]} items Array of menu items
 * @apiSuccess {Number} items.id Item ID
 * @apiSuccess {String} items.name Item name
 * @apiSuccess {String} items.description Item description
 * @apiSuccess {Number} items.price Price
 * @apiSuccess {String} items.category Category
 * @apiSuccess {String} items.image_url Image URL
 *
 * @apiError (500) DatabaseError Database query failed
 */

/**
 * @api {get} /api/menu/:id Get Menu Item by ID
 * @apiName GetMenuItemById
 * @apiGroup Menu Controller
 *
 * @apiParam {Number} id Item ID
 *
 * @apiSuccess {Object} item Menu item details
 *
 * @apiError (404) NotFound Item not found
 * @apiError (500) DatabaseError Database query failed
 */

/**
 * @api {post} /api/menu Create Menu Item
 * @apiName CreateMenuItem
 * @apiGroup Menu Controller
 * @apiUse AdminAuth
 *
 * @apiBody {String} name Item name
 * @apiBody {String} description Description
 * @apiBody {Number} price Price
 * @apiBody {String} category Category
 * @apiBody {Boolean} [popular] Is item popular
 * @apiBody {String} [dietary_info] Dietary information
 * @apiBody {File} image Image file
 *
 * @apiSuccess {Object} item Created item
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Ruokalistan kohde lisätty."
 *     }
 *
 * @apiError (400) ValidationError Invalid input
 */

/**
 * @api {put} /api/menu/:id Update Menu Item
 * @apiName UpdateMenuItem
 * @apiGroup Menu Controller
 * @apiUse AdminAuth
 *
 * @apiParam {Number} id Item ID
 * @apiBody {String} name Item name
 * @apiBody {String} description Description
 * @apiBody {Number} price Price
 * @apiBody {String} category Category
 * @apiBody {String} [image_url] Image URL
 * @apiBody {Boolean} [popular] Is item popular
 * @apiBody {String} [dietary_info] Dietary information
 *
 * @apiSuccess {Object} message Success message
 * @apiError (404) NotFound Item not found
 */

/**
 * @api {delete} /api/menu/:id Delete Menu Item
 * @apiName DeleteMenuItem
 * @apiGroup Menu Controller
 * @apiUse AdminAuth
 *
 * @apiParam {Number} id Item ID
 *
 * @apiSuccess {Object} message Success message
 * @apiError (404) NotFound Item not found
 */

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
  dietary_info: string | null;
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
        popular: Boolean(row['popular']),
        dietary_info: row['dietary_info'] as string | null,
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
        popular: Boolean(row['popular']),
        dietary_info: row['dietary_info'] as string | null,
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
    const {
      name,
      description,
      price,
      category,
      image_url,
      popular,
      dietary_info,
    } = req.body;

    if (!name || price === undefined) {
      res.status(400).json({error: 'Nimi ja hinta ovat pakollisia kenttiä.'});
      return;
    }

    await pool.query(
      'INSERT INTO MenuItems (name, description, price, category, image_url, popular, dietary_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        description,
        price,
        category,
        image_url,
        popular ? 1 : 0,
        dietary_info || null,
      ]
    );

    res.status(201).json({message: 'Ruokalistan kohde lisätty.'});
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
    const {
      name,
      description,
      price,
      category,
      image_url,
      popular,
      dietary_info,
    } = req.body;

    if (!id) {
      res.status(400).json({error: 'Tuote-id puuttuu.'});
      return;
    }

    await pool.query(
      'UPDATE MenuItems SET name = ?, description = ?, price = ?, category = ?, image_url = ?, popular = ?, dietary_info = ? WHERE item_id = ?',
      [
        name,
        description,
        price,
        category,
        image_url,
        popular ? 1 : 0,
        dietary_info || null,
        id,
      ]
    );

    res.json({message: 'Ruokalistan kohde päivitetty.'});
  } catch (error) {
    console.error('Virhe päivitettäessä ruokalistan kohdetta:', error);
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
