// src/controllers/driverController.ts

import {Request, Response, NextFunction} from 'express';
import pool from '../utils/db';

interface AuthenticatedRequest extends Request {
  user?: {userId: number; role: number};
}

export const getDriverOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              o.delivery_method, o.delivery_address,
              GROUP_CONCAT(JSON_OBJECT('product', m.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN MenuItems m ON oi.item_id = m.item_id
       WHERE o.status = 'Kuljetuksessa' AND o.is_archived = 0
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    );

    const formattedOrders = (orders as any[]).map((order) => ({
      order_id: order.order_id,
      customer_name: order.customer_name,
      order_date: order.order_date,
      status: order.status,
      delivery_method: order.delivery_method,
      delivery_address: order.delivery_address,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe kuljettajan tilausten haussa:', error);
    next(error);
  }
};
