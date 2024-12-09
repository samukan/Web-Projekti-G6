// src/app.ts

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
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
