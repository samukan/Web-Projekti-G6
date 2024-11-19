// src/app.ts

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes';
import menuRoutes from './routes/menuRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// Parse incoming JSON requests
app.use(bodyParser.json());

// Serve frontend assets
app.use(express.static(path.join(__dirname, '../public')));

// Serve compiled frontend scripts
app.use(
  '/scripts',
  express.static(path.join(__dirname, '../public-dist/scripts'))
);

// API routes
app.use('/admin', adminRoutes);
app.use('/api', menuRoutes);
app.use('/api/auth', authRoutes);

// Fallback for unhandled requests (404)
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Error handling middleware
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
