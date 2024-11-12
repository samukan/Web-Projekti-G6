// src/app.ts

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/api', menuRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

export default app;
