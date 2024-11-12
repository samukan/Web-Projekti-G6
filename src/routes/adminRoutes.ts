// src/routes/adminRoutes.ts

import {Router} from 'express';
import path from 'path';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateUser);
router.use(authorizeAdmin);

router.get('/menuAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/menuAdmin.html'));
});

router.get('/tilaukset', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/tilaukset.html'));
});

export default router;
