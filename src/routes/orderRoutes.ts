// src/routes/orderRoutes.ts

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
