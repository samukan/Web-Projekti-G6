// src/routes/adminApiRoutes.ts

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
