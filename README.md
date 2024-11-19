# 🛠️ Asennusohjeet

## Luo projektin juurikansioon .env-tiedosto seuraavalla sisällöllä:

```bash
DB_HOST=localhost
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=ravintola_db
JWT_SECRET=your-secret-key
```

Korvaa your-database-user, your-database-password ja your-secret-key omilla arvoillasi.

## Tietokannan luominen

```bash
source path/to/create-database.sql;
```

create-user.sql tiedostossa esimerkki käyttäjän luomisesta.

## Riippuvuuksien asentaminen

```bash
npm install
```

## Käynnistäminen

```bash
npm run build
npm start
```

## hashPasswords.js skriptin avulla Hashataan käyttäjien salasanat tietokannassa

```bash
node hashPasswords.js
```

## Sovelluksen käyttö

Avaa http://localhost:3000 selaimessa.
