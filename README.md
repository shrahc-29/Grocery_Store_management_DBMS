# 🛒 Grocery Store Management System

A full-stack grocery store management app built with **Next.js 16** (frontend) and **Express + MySQL** (backend).

## Features

- **Dashboard** — Live summary cards, stock bar chart with low-stock coloring, sales trend chart
- **Products** — Full CRUD, search, category filter, low-stock badges
- **Inventory** — Stock level cards with progress bars, add stock / record sale modal, low-stock alerts panel
- **Suppliers** — Full CRUD connected to database, search

---

## Project Structure

```
├── app/                   # Next.js pages
│   ├── page.tsx           # Dashboard
│   ├── products/page.tsx
│   ├── inventory/page.tsx
│   └── suppliers/page.tsx
├── components/            # Shared components
│   ├── product-modal.tsx
│   ├── supplier-modal.tsx
│   ├── inventory-modal.tsx
│   └── sidebar.tsx
├── backend/               # Express API
│   ├── server.js
│   ├── db.js              # MySQL pool connection
│   ├── schema.sql         # ← Run this first!
│   ├── .env.example
│   └── routes/
│       ├── products.js
│       ├── customers.js
│       ├── orders.js
│       ├── inventory.js
│       ├── suppliers.js
│       └── categories.js
```

---

## Setup

### 1. Database

```bash
mysql -u root -p < backend/schema.sql
```

This creates the `grocery_store` database, all tables, and seeds sample data.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev     # uses nodemon
# or: npm start
```

Backend runs on `http://localhost:5000`

### 3. Frontend

```bash
# In project root
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

> **Note:** The frontend gracefully falls back to mock data if the backend is offline, so you can develop the UI without a running database.

---

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/products                     | All products (with JOIN) |
| POST   | /api/products/add                 | Add product              |
| PUT    | /api/products/update/:id          | Update product           |
| DELETE | /api/products/delete/:id          | Delete product           |
| GET    | /api/products/alerts/low-stock    | Low stock products       |
| GET    | /api/suppliers                    | All suppliers            |
| POST   | /api/suppliers/add                | Add supplier             |
| PUT    | /api/suppliers/update/:id         | Update supplier          |
| DELETE | /api/suppliers/delete/:id         | Delete supplier          |
| GET    | /api/inventory                    | Inventory summary        |
| POST   | /api/inventory/adjust             | Adjust stock             |
| GET    | /api/customers                    | All customers            |
| POST   | /api/customers/add                | Add customer             |
| GET    | /api/orders                       | All orders               |
| POST   | /api/orders/create                | Create order             |
| GET    | /api/categories                   | All categories           |

---

## Environment Variables

Create `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_store
PORT=5000
```

For the frontend (optional, for deployment):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
