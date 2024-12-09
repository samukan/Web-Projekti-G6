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

When registering new users trough the application password hashing happens automatically. hashPasswords.js is only for hashing the test user passwords that are added when creating the database.

## Install dependencies:

```bash
npm install
```

## Running the app

```bash
npm run build
npm start
```

## 🧪 Testing

Run

```bash
npx playwright test
```

Update test snapshots:

```bash
npx playwright test --update-snapshots
```

## 📚 API Documentation

Generate documentation:

```bash
npm run apidoc
```

Open http://localhost:3000/docs

## View the app

Open http://localhost:3000

## 👥 User Roles & Credentials

Default test accounts:

| Role   | Email              | Password |
| ------ | ------------------ | -------- |
| Admin  | admin@example.com  | 123      |
| Driver | driver@example.com | 321      |
| User   | maija@example.com  | 1234     |

## 👏 Acknowledgments

- Bootstrap for UI components
- Font Awesome for icons
- HSL for map integration
