"use strict";
// src/routes/adminRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Tarkistetaan, että käyttäjä on kirjautunut
router.use(authMiddleware_1.authenticateUser);
// Tarkistetaan, että käyttäjä on admin ennen admin-sivujen lataamista
router.get('/menuAdmin', authMiddleware_1.authorizeAdmin, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/menuAdmin.html'));
});
router.get('/tilaukset', authMiddleware_1.authorizeAdmin, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/tilaukset.html'));
});
exports.default = router;
