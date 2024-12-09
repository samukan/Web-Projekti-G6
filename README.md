# 🍽️ Restaurant Management System

Full-stack web application for restaurant order management, including menu administration, order processing, and delivery tracking.

## ✨ Features

- 🔐 User authentication (Admin, Staff, Drivers)
- 📋 Menu management with image upload
- 🛒 Online ordering system
- 📦 Order status tracking
- 🚗 Delivery management
- 📱 Responsive design for mobile/desktop

## 🛠️ Technologies

- Frontend: HTML, CSS, TypeScript
- Backend: Node.js, Express
- Database: MySQL
- Testing: Playwright
- Documentation: ApiDoc

## 📋 Prerequisites

- Node.js (v18+)
- MySQL
- Git

## ⚙️ Installation

1. Clone repository:

2. Create ⚙️.env file :

```bash
DB_HOST=localhost
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=ravintola_db
JWT_SECRET=your-secret-key
```

Make sure to replace your-database-user, your-database-password and your-secret-key with your own credentials.

## Set up database

```bash
source path/to/create-database.sql;
node hashPasswords.js
```

## Install dependencies:

```bash
npm install
```

## Running the app

```bash
npm run build
npm start
```

## Sovelluksen käyttö

Avaa http://localhost:3000 selaimessa.
