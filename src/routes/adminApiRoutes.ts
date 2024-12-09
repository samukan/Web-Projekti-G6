// src/routes/adminApiRoutes.ts

/**
 * @apiDefine AdminEndpoints
 * All endpoints require admin authentication
 * @apiHeader {String} Authorization Bearer token
 */

/**
 * @api {post} /api/admin/menu Create Menu Item
 * @apiName CreateMenuItem
 * @apiGroup Admin Menu
 * @apiUse AdminEndpoints
 *
 * @apiBody {String} name Item name
 * @apiBody {String} description Item description
 * @apiBody {Number} price Item price
 * @apiBody {String} category Category
 * @apiBody {File} image Product image
 * @apiBody {String} [dietary_info] Dietary information
 *
 * @apiSuccess {Object} item Created menu item
 * @apiSuccess {Number} item.id Item ID
 * @apiSuccess {String} item.name Item name
 *
 * @apiError (400) ValidationError Invalid input parameters
 * @apiError (401) Unauthorized Missing or invalid token
 * @apiError (403) Forbidden Not an admin user
 */

/**
 * @api {put} /api/admin/orders/:id Update Order Status
 * @apiName UpdateOrderStatus
 * @apiGroup Admin Orders
 * @apiUse AdminEndpoints
 *
 * @apiParam {Number} id Order ID in URL
 * @apiBody {String} status New status
 *
 * @apiSuccess {Object} order Updated order
 * @apiSuccess {String} order.status New status
 *
 * @apiError (404) NotFound Order not found
 */

/**
 * @api {delete} /api/admin/orders/:id Delete Order
 * @apiName DeleteOrder
 * @apiGroup Admin Orders
 * @apiUse AdminEndpoints
 *
 * @apiParam {Number} id Order ID in URL
 *
 * @apiSuccess {Object} message Success message
 * @apiError (404) NotFound Order not found
 */

import {Router} from 'express';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController';
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';

const router = Router();

// Suojaa kaikki admin API -reitit autentikoinnilla ja autorisoinnilla
router.use(authenticateUser);
router.use(authorizeAdmin);

// Ruokalistan hallinta
router.post('/menu', addMenuItem);
router.get('/menu', getMenuItems);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Tilausten hallinta
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

export default router;
