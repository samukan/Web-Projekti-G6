// src/routes/adminRoutes.ts

import {Router} from 'express';
import path from 'path';
import {authenticateUser, authorizeAdmin} from '../middleware/authMiddleware';

const router = Router();

// Tarkistetaan, että käyttäjä on kirjautunut
router.use(authenticateUser);

// Tarkistetaan, että käyttäjä on admin ennen admin-sivujen lataamista
router.get('/menuAdmin', authorizeAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/menuAdmin.html'));
});

router.get('/tilaukset', authorizeAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/tilaukset.html'));
});

export default router;
