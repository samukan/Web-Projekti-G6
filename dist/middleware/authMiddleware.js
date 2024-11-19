"use strict";
// src/middleware/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Lisää käyttäjätiedot pyyntöön
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Virheellinen tai vanhentunut token' });
        }
    }
    else {
        res.status(401).json({ message: 'Token puuttuu' });
    }
};
exports.authenticateUser = authenticateUser;
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 1) {
        next(); // Käyttäjä on admin
    }
    else {
        res.status(403).json({ message: 'Ei oikeuksia admin-sivuille' });
    }
};
exports.authorizeAdmin = authorizeAdmin;
