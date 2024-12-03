// src/controllers/orderController.ts

import {Request, Response, NextFunction} from 'express';
import pool from '../utils/db';

interface AuthenticatedRequest extends Request {
  user?: {userId: number; role: number};
}

export const placeOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {customer, items} = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(401)
        .json({message: 'Sinun täytyy kirjautua sisään tehdäksesi tilauksen.'});
      return;
    }

    if (!customer || !items || items.length === 0) {
      res.status(400).json({message: 'Virheelliset tilauksen tiedot'});
      return;
    }

    // Käynnistää transaktion
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Lisää tilaus Orders-tauluun ja asetetaan status 'Aktiivinen'
      const [orderResult] = await connection.query(
        'INSERT INTO Orders (user_id, customer_name, order_date, status) VALUES (?, ?, NOW(), ?)',
        [userId, customer, 'Aktiivinen']
      );

      const orderId = (orderResult as any).insertId;

      // Lisää tilausrivit OrderItems-tauluun
      const orderItems = items.map((item: any) => [
        orderId,
        item.product,
        item.quantity,
        item.price,
      ]);

      await connection.query(
        'INSERT INTO OrderItems (order_id, product_name, quantity, price) VALUES ?',
        [orderItems]
      );

      // Commit transaktio
      await connection.commit();

      res.status(201).json({message: 'Tilaus vastaanotettu', orderId});
    } catch (error) {
      await connection.rollback();
      console.error('Transaktio epäonnistui:', error);
      res.status(500).json({message: 'Tilauksen tallentaminen epäonnistui'});
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Virhe tilauksen käsittelyssä:', error);
    next(error);
  }
};

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Varmistetaan, että käyttäjä on admin
    if (req.user?.role !== 1) {
      res.status(403).json({message: 'Ei oikeuksia nähdä kaikkia tilauksia'});
      return;
    }

    // Haetaan tilaukset ja niiden tilausrivit
    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              GROUP_CONCAT(JSON_OBJECT('product', oi.product_name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    );

    // Muokataan data helpommin käsiteltävään muotoon.
    const formattedOrders = (orders as any[]).map((order) => {
      return {
        order_id: order.order_id,
        customer_name: order.customer_name,
        order_date: order.order_date,
        status: order.status,
        items: JSON.parse('[' + order.items + ']'),
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    next(error);
  }
};

// Päivittää tilauksen statuksen
export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Varmistetaan, että käyttäjä on admin
    if (req.user?.role !== 1) {
      res.status(403).json({message: 'Ei oikeuksia päivittää tilausta'});
      return;
    }

    const orderId = req.params.id;
    const {status} = req.body;

    if (!status) {
      res.status(400).json({message: 'Status on pakollinen'});
      return;
    }

    // Päivitä tilauksen status tietokannassa
    const [result] = await pool.query(
      'UPDATE Orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({message: 'Tilausta ei löytynyt'});
      return;
    }

    res.json({message: 'Tilauksen status päivitetty'});
  } catch (error) {
    console.error('Virhe tilauksen statuksen päivittämisessä:', error);
    next(error);
  }
};

// Poistaa tilauksen
export const deleteOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Varmistetaan, että käyttäjä on admin
    if (req.user?.role !== 1) {
      res.status(403).json({message: 'Ei oikeuksia poistaa tilauksia'});
      return;
    }

    const orderId = req.params.id;

    if (!orderId) {
      res.status(400).json({message: 'Tilaus ID puuttuu'});
      return;
    }

    // Poista tilaus OrderItems-taulusta ensin
    await pool.query('DELETE FROM OrderItems WHERE order_id = ?', [orderId]);

    // Poista tilaus Orders-taulusta
    const [result] = await pool.query('DELETE FROM Orders WHERE order_id = ?', [
      orderId,
    ]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({message: 'Tilausta ei löytynyt'});
      return;
    }

    res.json({message: 'Tilaus poistettu onnistuneesti'});
  } catch (error) {
    console.error('Virhe tilauksen poistamisessa:', error);
    next(error);
  }
};

// Uusi funktio asiakkaan omien tilausten hakemiseen
export const getCustomerOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: 'Sinun täytyy kirjautua sisään nähdäksesi tilauksesi.',
      });
      return;
    }

    // Haetaan tilaukset ja niiden tilausrivit käyttäjälle
    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              GROUP_CONCAT(JSON_OBJECT('product', oi.product_name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`,
      [userId]
    );

    // Muokataan data helpommin käsiteltävään muotoon.
    const formattedOrders = (orders as any[]).map((order) => {
      return {
        order_id: order.order_id,
        customer_name: order.customer_name,
        order_date: order.order_date,
        status: order.status,
        items: JSON.parse('[' + order.items + ']'),
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    next(error);
  }
};
