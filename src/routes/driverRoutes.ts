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
