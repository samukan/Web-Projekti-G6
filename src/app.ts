// src/app.ts
//  Sovelluksen pää, määrittelee asetuksia ja käynnistää palvelimen.

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// Parse inc JSON
app.use(bodyParser.json());

// Julkiset tiedosto, esim css kuvat yms.
app.use(express.static(path.join(__dirname, '../public')));

// frontend puolen scriptit
app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

// API reitit
app.use('/admin', adminRoutes);
app.use('/api', menuRoutes);
app.use('/api/auth', authRoutes);

// Jos ei löydy mitään (404)
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Errori käsittelijä
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  }
);

export default app;
