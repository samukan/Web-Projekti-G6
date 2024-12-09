// src/controllers/driverController.ts

/**
 * @api {get} /api/driver/orders Get Driver Orders
 * @apiName GetDriverOrders
 * @apiGroup Driver Controller
 * @apiUse DriverAuth
 *
 * @apiSuccess {Object[]} orders List of delivery orders
 * @apiSuccess {Number} orders.id Order ID
 * @apiSuccess {String} orders.status Order status
 * @apiSuccess {String} orders.delivery_address Delivery address
 * @apiSuccess {String} orders.customer_name Customer name
 * @apiSuccess {Object[]} orders.items Order items
 *
 * @apiError (401) Unauthorized Driver authentication required
 * @apiError (403) Forbidden User is not a driver
 * @apiError (500) DatabaseError Failed to fetch orders
 */

/**
 * @api {put} /api/driver/orders/:id/update-status Update Delivery Status
 * @apiName UpdateDeliveryStatus
 * @apiGroup Driver Controller
 * @apiUse DriverAuth
 *
 * @apiParam {Number} id Order's ID
 * @apiBody {String} status New status ("Kuljetettu perille")
 *
 * @apiSuccess {Object} order Updated order details
 * @apiSuccess {String} order.status New status
 * @apiSuccess {String} order.updated_at Update timestamp
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "status": "Kuljetettu perille"
 *     }
 *
 * @apiError (400) InvalidStatus Invalid status transition
 * @apiError (404) NotFound Order not found
 * @apiError (500) DatabaseError Update failed
 */

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
