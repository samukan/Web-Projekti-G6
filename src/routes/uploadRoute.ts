// src/routes/uploadRoute.ts

/**
 * @api {post} /api/upload Upload Image
 * @apiName UploadImage
 * @apiGroup Upload
 * @apiUse AdminAuth
 *
 * @apiDescription Upload product image for menu items
 *
 * @apiBody {File} image Image file
 * @apiBody {String} [filename] Optional filename
 *
 * @apiSuccess {Object} response Upload result
 * @apiSuccess {String} response.filename Saved filename
 * @apiSuccess {String} response.path File path
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "filename": "product-123.jpg",
 *       "path": "/uploads/product-123.jpg"
 *     }
 *
 * @apiError (400) InvalidFile No file uploaded or invalid file type
 * @apiError (413) FileTooLarge File size exceeds limit
 * @apiError (500) UploadError File upload failed
 */

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
