import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';

// Importoi reitit ja muut tarvittavat moduulit
// import authRoutes from './routes/authRoutes';
// import menuRoutes from './routes/menuRoutes';
// import orderRoutes from './routes/orderRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/api', menuRoutes);

// Palvellaan staattisia tiedostoja public-kansiosta
app.use(express.static(path.join(__dirname, '../public')));

// Palvellaan käännettyjä front-end-skriptejä
app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

// Muu middleware ja reitit
// app.use('/api/auth', authRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/orders', orderRoutes);

export default app;
