// src/routes/menuRoutes.ts
// Tässä filessä ruokalistan tarjoilu

import {Router} from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Lähetetään ruokalista frontille
router.get('/menu', (req, res) => {
  const menuPath = path.join(__dirname, '../../data/menu.json'); // Ruokalistan sijainti projektissa

  fs.readFile(menuPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Virhe luettaessa menu.json-tiedostoa:', err);
      res.status(500).json({message: 'Virhe ladattaessa ruokalistaa'});
      return;
    }

    try {
      const menu = JSON.parse(data);
      res.json(menu);
    } catch (parseError) {
      console.error('Virhe jäsennettäessä menu.json-tiedostoa:', parseError);
      res.status(500).json({message: 'Virhe ladattaessa ruokalistaa'});
    }
  });
});

export default router;
