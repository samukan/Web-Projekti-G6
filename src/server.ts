// src/server.ts

/**
 * @apiDefine general General information about the API
 */

/**
 * @api {general} / API Information
 * @apiName ApiInformation
 * @apiGroup General
 * @apiVersion 1.0.0
 * @apiDescription Restaurant management system API entry point.
 * Provides endpoints for menu management, order processing, and user authentication.
 *
 * @apiSuccess {String} status Server status message
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Server running on port 3000"
 *     }
 */

import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Palvelin käynnistyy portissa ${PORT}`);
});
