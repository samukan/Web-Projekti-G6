// src/routes/orderRoutes.ts

/**
 * @api {post} /api/orders Create Order
 * @apiName CreateOrder
 * @apiGroup Orders
 * @apiUse UserAuth
 *
 * @apiBody {Object[]} items Order items
 * @apiBody {Number} items.product_id Product ID
 * @apiBody {Number} items.quantity Quantity
 * @apiBody {String} delivery_method Delivery method
 * @apiBody {String} [delivery_address] Delivery address
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "items": [{
 *         "product_id": 1,
 *         "quantity": 2
 *       }],
 *       "delivery_method": "delivery",
 *       "delivery_address": "Example Street 123"
 *     }
 *
 * @apiSuccess {Number} order_id Created order ID
 * @apiSuccess {String} status Order status
 *
 * @apiError (400) InvalidInput Missing or invalid parameters
 * @apiError (401) Unauthorized Authentication required
 */

/**
 * @api {get} /api/orders Get All Orders
 * @apiName GetOrders
 * @apiGroup Orders
 * @apiUse AdminAuth
 *
 * @apiSuccess {Object[]} orders List of orders
 * @apiSuccess {Number} orders.id Order ID
 * @apiSuccess {String} orders.status Order status
 * @apiSuccess {Object[]} orders.items Order items
 * @apiSuccess {String} orders.delivery_method Delivery method
 *
 * @apiError (401) Unauthorized Admin authentication required
 */

import {Router} from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
  getCustomerOrders,
  getArchivedOrders,
  getDeliveryOrders,
  deleteOrder,
} from '../controllers/orderController';
import {
  authenticateUser,
  authorizeAdmin,
  authorizeDriver,
  authorizeAdminOrDriver,
} from '../middleware/authMiddleware';

const router = Router();

// Tilauksen tekeminen vaatii autentikoinnin
router.post('/', authenticateUser, placeOrder);

// Admin-reitit tilauksien hallintaan
router.get('/', authenticateUser, authorizeAdmin, getOrders);
router.get('/archived', authenticateUser, authorizeAdmin, getArchivedOrders);

// Päivitä tilauksen status – sallitaan admin ja kuljettaja
router.put(
  '/:id/status',
  authenticateUser,
  authorizeAdminOrDriver,
  updateOrderStatus
);

// Lisätään reitti tilauksen poistamiseen
router.delete('/:id', authenticateUser, authorizeAdmin, deleteOrder);

// Kuljettajien reitti tilauksien hakemiseen
router.get(
  '/driver/orders',
  authenticateUser,
  authorizeDriver,
  getDeliveryOrders
);

// Asiakkaan omien tilausten hakemiseen
router.get('/myOrders', authenticateUser, getCustomerOrders);

export default router;
