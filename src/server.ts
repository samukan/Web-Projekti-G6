// src/server.ts
// Tää käynnistää bileet

import app from './app';
import dotenv from 'dotenv';

dotenv.config(); // Lataa env

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Palvelin käynnistyy portissa ${PORT}`);
});
