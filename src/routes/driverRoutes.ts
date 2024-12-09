// src/routes/driverRoutes.ts

/**
 * @apiDefine DriverAuth
 * @apiHeader {String} Authorization Bearer token for driver authentication
 * @apiError (401) Unauthorized Driver authentication required
 * @apiError (403) Forbidden User is not a driver
 */

/**
 * @api {get} /api/driver/orders Get Driver Orders
 * @apiName GetDriverOrders
 * @apiGroup Driver
 * @apiUse DriverAuth
 *
 * @apiSuccess {Object[]} orders List of deliverable orders
 * @apiSuccess {Number} orders.id Order ID
 * @apiSuccess {String} orders.status Order status
 * @apiSuccess {String} orders.delivery_address Delivery address
 * @apiSuccess {String} orders.customer_name Customer name
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "id": 1,
 *       "status": "Tilaus on kuljetuksessa",
 *       "delivery_address": "Example Street 123",
 *       "customer_name": "John Doe"
 *     }]
 */

/**
 * @api {put} /api/driver/orders/:id/status Update Order Status
 * @apiName UpdateOrderStatus
 * @apiGroup Driver
 * @apiUse DriverAuth
 *
 * @apiParam {Number} id Order ID
 * @apiBody {String} status New status
 *
 * @apiSuccess {Object} order Updated order information
 *
 * @apiError (404) NotFound Order not found
 * @apiError (400) InvalidStatus Invalid status transition
 */

import {Router} from 'express';
import {authenticateUser, authorizeDriver} from '../middleware/authMiddleware';
import {getDriverOrders} from '../controllers/driverController';
import {updateOrderStatus} from '../controllers/orderController';

const router = Router();

// Kuljettajien tilausten haku
router.get('/orders', authenticateUser, authorizeDriver, getDriverOrders);

// Tilauksen statuksen päivittäminen kuljettajalle
router.put(
  '/orders/:id/status',
  authenticateUser,
  authorizeDriver,
  updateOrderStatus
);

export default router;
