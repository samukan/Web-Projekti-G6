// src/routes/orderRoutes.ts

import {Router} from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateUser, placeOrder);
router.get('/', authorizeAdmin, getOrders);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

export default router;
