// src/routes/menuRoutes.ts

import {Router} from 'express';
import {
  getMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

// Reitti ruokalistan kohteiden hakemiseen (julkinen)
router.get('/', getMenuItems);

// Reitti yksittäisen tuotteen hakemiseen
router.get('/:id', getMenuItemById);

// Reitit ruokalistan kohteiden hallintaan (vain admin)
router.post('/', authenticateUser, authorizeAdmin, addMenuItem);
router.put('/:id', authenticateUser, authorizeAdmin, updateMenuItem);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteMenuItem);

export default router;
