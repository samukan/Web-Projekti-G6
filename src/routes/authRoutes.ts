// src/routes/authRoutes.ts

import {Router} from 'express';
import {login, verifyToken, register} from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/verify
router.post('/verify', verifyToken);

export default router;
