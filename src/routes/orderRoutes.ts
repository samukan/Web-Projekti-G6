// src/routes/orderRoutes.ts
// Tilaukset tulee menee ja jotain muuta ehkä?

import {Router} from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

// Julkinen reitti tilauksen tekemiseen
router.post('/', placeOrder);

// Admin-reitit tilauksien hallintaan
router.get('/', authenticateUser, authorizeAdmin, getOrders);
router.put('/:id/status', authenticateUser, authorizeAdmin, updateOrderStatus);

export default router;
