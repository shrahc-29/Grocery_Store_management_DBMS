# Grocery Store Management System

A modern, full-featured grocery store product management and inventory tracking system built for college DBMS mini projects.

## Features

- **Dashboard**: Real-time summary cards and data visualization
  - Total product types, stock levels, daily sales, active suppliers
  - Daily sales trends chart
  - Stock levels by product chart

- **Product Management**
  - View all products in a sortable, searchable table
  - Filter products by category
  - Add new products with validation
  - Edit existing products
  - Delete products
  - Real-time stock status indicators

- **Supplier Management**
  - View all suppliers with detailed information
  - Add/edit/delete suppliers
  - Track products supplied by each supplier
  - Contact information and address management

- **Inventory Tracking**
  - Track stock movements in real-time
  - Record stock received from suppliers
  - Record product sales
  - View detailed inventory history
  - Current stock level visualization

## Technology Stack

- **Frontend**: React 19, Next.js 16
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks with useMemo

## Project Structure

```
├── app/
│   ├── page.tsx              # Dashboard
│   ├── products/page.tsx     # Products management
│   ├── suppliers/page.tsx    # Suppliers management
│   ├── inventory/page.tsx    # Inventory tracking
│   ├── layout.tsx            # Root layout with sidebar
│   └── globals.css           # Global styles & theme
├── components/
│   ├── sidebar.tsx           # Navigation sidebar
│   ├── product-modal.tsx     # Product add/edit form
│   ├── supplier-modal.tsx    # Supplier add/edit form
│   ├── inventory-modal.tsx   # Inventory transaction form
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── mock-data.ts          # Sample data & interfaces
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Getting Started

### Installation

1. Clone the repository or download the project files
2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## Color Scheme

The application uses a fresh, grocery-themed color palette:
- **Primary Green**: #4a9d6f - Main brand color for actions and highlights
- **Accent Green**: #68b588 - Secondary green for accents
- **Light Backgrounds**: Off-white and soft greens
- **Text**: Dark grays for excellent contrast

## Data Structure

The system uses the following mock data structures:

### Product
- ID, Name, Category, Price, Stock quantity, Supplier

### Supplier
- ID, Name, Contact number, Address, Products supplied

### Inventory Movement
- ID, Product ID, Quantity received, Quantity sold, Remaining stock, Date

## Features to Enhance

When integrating with a real database, consider:
- Backend API integration for CRUD operations
- Database persistence (PostgreSQL, MongoDB, etc.)
- User authentication and authorization
- Real-time data synchronization
- Advanced reporting and analytics
- Multi-user support with role-based access

## Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth interactions
- **Dark Mode Ready**: Color tokens support light/dark theme switching
- **Accessibility**: Semantic HTML and ARIA attributes
- **Form Validation**: Client-side validation with error messages

## License

Created for educational purposes as a DBMS mini project.
