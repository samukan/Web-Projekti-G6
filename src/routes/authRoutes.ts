// src/routes/authRoutes.ts
/**
 * @api {post} /api/auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiBody {String} email User email
 * @apiBody {String} password User password
 *
 * @apiSuccess {String} token JWT token
 */

/**
 * @api {post} /api/auth/verify Verify Token
 * @apiName VerifyToken
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authorization Bearer token
 */

import {Router} from 'express';
import {login, register, verifyToken} from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify', verifyToken);

export default router;
