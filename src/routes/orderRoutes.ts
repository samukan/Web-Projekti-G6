// src/routes/orderRoutes.ts

import {Router} from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import {
  authenticateUser,
  authenticateAdmin,
} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateUser, placeOrder);
router.get('/', authenticateAdmin, getOrders);
router.put('/:id/status', authenticateAdmin, updateOrderStatus);

export default router;
