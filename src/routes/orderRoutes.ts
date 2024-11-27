// src/routes/orderRoutes.ts

import {Router} from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
  getCustomerOrders,
} from '../controllers/orderController';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

// Tilauksen tekeminen vaatii autentikoinnin
router.post('/', authenticateUser, placeOrder);

// Admin-reitit tilauksien hallintaan
router.get('/', authenticateUser, authorizeAdmin, getOrders);
router.put('/:id/status', authenticateUser, authorizeAdmin, updateOrderStatus);

// Uusi reitti asiakkaan omien tilausten hakemiseen
router.get('/myOrders', authenticateUser, getCustomerOrders);

export default router;
