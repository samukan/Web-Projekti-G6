// src/routes/adminRoutes.ts

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
