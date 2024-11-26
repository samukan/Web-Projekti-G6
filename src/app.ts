// src/app.ts
// Sovelluksen sydän – tänne kaikki reitit ja middlewaret

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();

// Tulkitsee sisääntulevan JSONin
app.use(bodyParser.json());

// Staattiset frontend-tiedostot
app.use(express.static(path.join(__dirname, '../public')));

// käännetyt JS/TS-tiedostot
app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

// reitit (API ja sivustot)
app.use('/admin', adminRoutes);
app.use('/api', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// tuntemattomat pyynnöt saavat 404-virheen
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Virheenkäsittelijä – jos kaikki muu menee pieleen.
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
