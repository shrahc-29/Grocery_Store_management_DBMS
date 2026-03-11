# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Run Development Server
```bash
pnpm dev
```

### Step 3: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Exploring the Application

### Dashboard (Home)
- View summary metrics (total products, stock, sales, suppliers)
- See daily sales trends
- Monitor stock levels by product
- **Access**: Click "Dashboard" in sidebar or navigate to `/`

### Products Management
- Browse all products in a searchable table
- Filter products by category
- Add new products with the "Add Product" button
- Edit or delete existing products
- **Access**: Click "Products" in sidebar or navigate to `/products`

### Suppliers Management
- View all suppliers in card format
- Search by name, ID, or contact number
- Add new suppliers
- Edit supplier information
- Manage products supplied by each supplier
- **Access**: Click "Suppliers" in sidebar or navigate to `/suppliers`

### Inventory Tracking
- View current inventory levels
- See stock received and sold statistics
- Record new stock arrivals
- Record product sales
- View detailed inventory history
- **Access**: Click "Inventory" in sidebar or navigate to `/inventory`

---

## 🎨 Color Theme

The app uses a fresh green grocery theme:
- **Primary Green**: Used for main actions and highlights
- **Light Green**: Secondary accents
- **White/Off-white**: Backgrounds
- **Red**: Destructive actions (delete)
- **Stock Status**:
  - 🟢 Green: Stock > 100 units
  - 🟡 Yellow: Stock 50-100 units
  - 🔴 Red: Stock < 50 units

---

## 📊 Sample Data

The application comes with pre-loaded sample data:
- **6 Products** across different categories (Fruits, Vegetables, Dairy, Bakery)
- **5 Suppliers** with contact information and product associations
- **7-day sales data** showing sales trends
- **Inventory movements** tracking stock changes

---

## 🎯 Main Features

### 1. **Real-time Search**
- Search products by name or ID
- Search suppliers by name, ID, or contact
- Search inventory by product name or ID

### 2. **Filtering**
- Filter products by category
- View specific categories only

### 3. **Data Visualization**
- Line chart for daily sales trends
- Bar chart for stock levels
- Summary cards with KPIs

### 4. **Forms & Modals**
- Add Product: Create new products with validation
- Edit Product: Modify existing products
- Add Supplier: Create suppliers with product selection
- Inventory Transactions: Record stock additions and sales

### 5. **Responsive Design**
- Works on desktop, tablet, and mobile
- Sidebar navigation on all devices
- Responsive grids and tables

---

## 🔧 Customization

### Change Colors
Edit `/app/globals.css` and modify the CSS variables in the `:root` section:
```css
:root {
  --primary: oklch(0.58 0.15 142.5);      /* Main brand color */
  --accent: oklch(0.68 0.18 142.5);       /* Accent color */
  --background: oklch(0.99 0.001 106.4);  /* Background */
}
```

### Update Mock Data
Edit `/lib/mock-data.ts` to change sample data:
```typescript
export const mockProducts = [
  { id: 'P001', name: 'Your Product', ... },
  // Add more products
];
```

### Modify Sidebar Navigation
Edit `/components/sidebar.tsx` to add/remove navigation items:
```typescript
const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  // Add more items
];
```

---

## 📁 Project Structure

```
app/
├── page.tsx                 # Dashboard
├── products/page.tsx        # Products page
├── suppliers/page.tsx       # Suppliers page
├── inventory/page.tsx       # Inventory page
├── layout.tsx              # Root layout
└── globals.css             # Theme & styles

components/
├── sidebar.tsx             # Navigation
├── product-modal.tsx       # Product form
├── supplier-modal.tsx      # Supplier form
├── inventory-modal.tsx     # Inventory form
└── ui/                     # UI components

lib/
├── mock-data.ts           # Sample data
└── utils.ts               # Utilities
```

---

## 🎯 Common Tasks

### Add a New Product
1. Navigate to Products page
2. Click "Add Product" button
3. Fill in product details
4. Click "Create"

### Record Stock Received
1. Navigate to Inventory page
2. Find the product
3. Click "Add Stock" button
4. Enter quantity
5. Click "Add Stock"

### Record a Sale
1. Navigate to Inventory page
2. Find the product
3. Click "Record Sale" button
4. Enter quantity sold
5. Click "Record Sale"

### Search for Products
1. Navigate to Products page
2. Type in the search field
3. Results filter in real-time

### Filter by Category
1. Navigate to Products page
2. Click category buttons (All, Fruits, Vegetables, etc.)
3. Table updates to show filtered products

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is in use, start dev server on a different port:
```bash
pnpm dev -- -p 3001
```

### Dependencies Not Installing
Clear node_modules and reinstall:
```bash
rm -rf node_modules
pnpm install
```

### Styles Not Loading
Ensure Tailwind CSS is properly initialized:
```bash
pnpm dev
```

---

## 📚 Tech Stack Reference

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: High-quality UI components
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **React Hook Form**: Form state management
- **Zod**: Form validation

---

## 🚀 Next Steps

1. Explore each page and feature
2. Try creating new products/suppliers
3. Record inventory movements
4. Customize the color theme
5. Update mock data with your own
6. Consider integrating with a backend database

---

## 📖 Additional Resources

- See `README.md` for detailed project information
- See `LAYOUT_GUIDE.md` for visual layout explanations
- See `IMPLEMENTATION_SUMMARY.md` for technical details

---

**Ready to use!** Start the development server and begin exploring your Grocery Store Management System.
