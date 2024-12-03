// src/routes/uploadRoute.ts

import express, {Request, Response, NextFunction} from 'express';
import upload from '../middleware/upload';

const router = express.Router();

// Reitti kuvan lataamiseen
router.post(
  '/upload',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file) {
      res.status(400).json({message: 'Kuvaa ei ladattu.'});
      return;
    }

    // Palauta ladatun kuvan polku
    res.status(200).json({imageUrl: `/images/${req.file.filename}`});
  }
);

export default router;
