"use strict";
// src/routes/orderRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticateUser, orderController_1.placeOrder);
router.get('/', authMiddleware_1.authorizeAdmin, orderController_1.getOrders);
router.put('/:id/status', authMiddleware_1.authorizeAdmin, orderController_1.updateOrderStatus);
exports.default = router;
