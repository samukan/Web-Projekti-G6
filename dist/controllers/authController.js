"use strict";
// src/controllers/authController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../utils/db"));
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Fetch user by email
        const [rows] = await db_1.default.query('SELECT user_id, role_id, email, password FROM Users WHERE email = ?', [email]);
        const user = rows[0]; // Extract the first user
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Validate password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, message: 'Login successful' });
    }
    catch (error) {
        next(error); // Pass unexpected errors to the Express error handler
    }
};
exports.login = login;
