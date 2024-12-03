// src/app.ts

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import adminApiRoutes from './routes/adminApiRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Tulkitsee sisääntulevan JSONin
app.use(bodyParser.json());

// Reitit (API ja sivustot)
// Lisää adminRoutes ensin varmistaaksesi, että ne eivät kohdistu muihin middlewareihin
app.use('/admin', adminRoutes);

// Suojattu admin API reitit
app.use('/api/admin', adminApiRoutes);

// Muut API-reitit
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Palvellaan myOrders.html suojaten reitti
import {authenticateUser} from './middleware/authMiddleware';

app.get('/myOrders', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/myOrders.html'));
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
