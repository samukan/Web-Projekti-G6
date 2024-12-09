// src/routes/adminRoutes.ts

/**
 * @api {get} /admin/menuAdmin Menu Admin Page
 * @apiName GetMenuAdminPage
 * @apiGroup Admin Pages
 * @apiPermission admin
 *
 * @apiDescription Serves the menu administration page
 *
 * @apiSuccess {HTML} page Menu admin page HTML
 * @apiError (403) Forbidden Admin access required
 */

/**
 * @api {get} /admin/tilaukset Orders Admin Page
 * @apiName GetOrdersAdminPage
 * @apiGroup Admin Pages
 * @apiPermission admin
 *
 * @apiDescription Serves the order management page
 *
 * @apiSuccess {HTML} page Orders admin page HTML
 * @apiError (403) Forbidden Admin access required
 */

/**
 * @api {post} /api/admin/menu Add Menu Item
 * @apiName AddMenuItem
 * @apiGroup Admin API
 * @apiUse AdminAuth
 *
 * @apiBody {String} name Item name
 * @apiBody {String} description Item description
 * @apiBody {Number} price Item price
 * @apiBody {String} category Item category
 * @apiBody {File} image Item image file
 *
 * @apiSuccess {Object} item Created menu item
 * @apiError (400) InvalidInput Missing or invalid parameters
 */

import {Router} from 'express';
import path from 'path';

const router = Router();

// Palvellaan admin-sivut ilman alustavaa autentikointia
router.get('/menuAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/menuAdmin.html'));
});

router.get('/tilaukset', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/tilaukset.html'));
});

export default router;
