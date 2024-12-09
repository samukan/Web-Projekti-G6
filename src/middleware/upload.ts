// src/middleware/upload.ts

/**
 * @api {post} /api/upload Upload File
 * @apiName FileUpload
 * @apiGroup Upload
 * @apiUse AdminAuth
 *
 * @apiDescription Upload image file middleware configuration
 *
 * @apiBody {File} image Image file to upload
 * @apiBody {String} [filename] Optional custom filename
 *
 * @apiSuccess {Object} response Upload result
 * @apiSuccess {String} response.filename Saved filename
 * @apiSuccess {String} response.path File path
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "filename": "image-1234567890.jpg",
 *       "path": "/images/image-1234567890.jpg"
 *     }
 *
 * @apiError (400) FileTypeError Only jpeg, jpg, png, gif files allowed
 * @apiError (413) FileSizeError File size exceeds 5MB limit
 * @apiError (500) UploadError File upload failed
 */

import multer from 'multer';
import path from 'path';

// Määrittele tallennuskansio ja tiedostonimi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images')); // Varmista, että kansio on olemassa
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Tiedostojen suodatin: sallitaan vain kuvatiedostot
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  } else {
    cb(new Error('Vain kuvatiedostot ovat sallittuja!'));
  }
};

// Määrittele Multer
const upload = multer({
  storage: storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB
  fileFilter: fileFilter,
});

export default upload;
