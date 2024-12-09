// src/app.ts

/**
 * @apiDefine AdminAuth Admin authentication required
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiError (401) {Object} Unauthorized Authentication token missing or invalid
 * @apiError (403) {Object} Forbidden User is not an admin
 */

/**
 * @apiDefine UserAuth User authentication required
 * @apiHeader {String} Authorization Bearer token for user authentication
 * @apiError (401) {Object} Unauthorized Authentication token missing or invalid
 */

/**
 * @api {general} /api API Routes Overview
 * @apiName ApiRoutes
 * @apiGroup Application
 * @apiVersion 1.0.0
 *
 * @apiDescription Main application routes configuration
 *
 * - `/admin/*` - Admin page routes
 * - `/api/admin/*` - Protected admin API routes
 * - `/api/menu/*` - Public menu routes
 * - `/api/auth/*` - Authentication routes
 * - `/api/orders/*` - Order management routes
 * - `/api/driver/*` - Driver routes
 */

import express from 'express';
import path from 'path';
const bodyParser = require('body-parser');
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';
import authRoutes from './routes/authRoutes';
import uploadRoute from './routes/uploadRoute';
import orderRoutes from './routes/orderRoutes';
import adminApiRoutes from './routes/adminApiRoutes';
import driverRoutes from './routes/driverRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Tulkitsee sisääntulevan JSONin
app.use(bodyParser.json());

// Reitit (API ja sivustot)
app.use('/admin', adminRoutes);

// Suojattu admin API reitit
app.use('/api/admin', adminApiRoutes);

// Muut API-reitit
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Kuvien latausreitti
app.use('/api/upload', uploadRoute);

app.use('/api/driver', driverRoutes);

app.use('/docs', express.static('docs'));

// Palvellaan myOrders.html ilman autentikointia
app.get('/myOrders', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/myOrders.html'), (err) => {
    if (err) {
      console.error('Error sending myOrders.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/driver/orders', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/driverOrders.html'), (err) => {
    if (err) {
      console.error('Error sending driverOrders.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});
// Staattiset frontend-tiedostot
app.use(express.static(path.join(__dirname, '../public')));

// Käännetyt JS/TS-tiedostot
app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

// Tuntemattomat pyynnöt saavat 404-virheen
app.use((req, res, next) => {
  res.status(404).json({message: 'Page not found'});
});

// Virheenkäsittelijä
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong!'});
  }
);

export default app;
