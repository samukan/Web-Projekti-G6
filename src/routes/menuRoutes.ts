// src/routes/menuRoutes.ts
/**
 * @apiDefine PublicAccess No authentication required
 */

/**
 * @api {get} /api/menu Get All Menu Items
 * @apiName GetMenuItems
 * @apiGroup Menu
 * @apiUse PublicAccess
 *
 * @apiSuccess {Object[]} items List of menu items
 */

/**
 * @api {post} /api/menu Create Menu Item
 * @apiName AddMenuItem
 * @apiGroup Menu
 * @apiUse AdminAuth
 *
 * @apiBody {String} name Item name
 * @apiBody {String} description Description
 * @apiBody {Number} price Price
 */

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

// Reitti yksittäisen tuotteen hakemiseen (julkinen)
router.get('/:id', getMenuItemById);

// Reitit ruokalistan kohteiden hallintaan (vain admin)
router.post('/', authenticateUser, authorizeAdmin, addMenuItem);
router.put('/:id', authenticateUser, authorizeAdmin, updateMenuItem);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteMenuItem);

export default router;
