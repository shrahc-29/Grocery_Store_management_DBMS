# Application Layout Guide

## Overall Structure

The application uses a sidebar navigation layout with the main content area:

```
┌─────────────────────────────────────────────┐
│  GroceryStore │   Main Content Area        │
│  Dashboard  │                             │
│  Products   │   (Page-specific content)   │
│  Suppliers  │                             │
│  Inventory  │                             │
└─────────────────────────────────────────────┘
```

## Page Layouts

### Dashboard (/)
```
Header: "Dashboard"

┌─────────────────────────────────────────┐
│ Summary Cards Grid (4 columns)           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │Card1 │ │Card2 │ │Card3 │ │Card4 │    │
│ └──────┘ └──────┘ └──────┘ └──────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Charts Grid (2 columns)                  │
│ ┌──────────────────┐ ┌───────────────┐  │
│ │ Daily Sales      │ │ Stock Levels  │  │
│ │ Line Chart       │ │ Bar Chart     │  │
│ │                  │ │               │  │
│ └──────────────────┘ └───────────────┘  │
└─────────────────────────────────────────┘
```

**Summary Cards:**
- Total Product Types
- Total Stock
- Sold Today
- Active Suppliers

**Charts:**
- Daily Sales This Week (Line chart)
- Stock Levels by Product (Bar chart)

---

### Products Management (/products)
```
Header: "Products" + [Add Product] Button

┌─────────────────────────────────────────┐
│ Search & Filter Card                     │
│ ┌──────────────────────────────────────┐ │
│ │ [Search input field]                 │ │
│ │ [Category filter buttons]             │ │
│ └──────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Products Table                           │
│ ┌────────────────────────────────────┐  │
│ │ ID │ Name │ Category │ Price │ ... │  │
│ ├────────────────────────────────────┤  │
│ │ P1 │ ...  │ ...      │ ...   │ ... │  │
│ │ P2 │ ...  │ ...      │ ...   │ ... │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Features:**
- Search by product name or ID
- Filter by category
- Sortable columns
- Edit/Delete actions
- Stock status color coding

---

### Suppliers Management (/suppliers)
```
Header: "Suppliers" + [Add Supplier] Button

┌─────────────────────────────────────────┐
│ Search Card                              │
│ ┌──────────────────────────────────────┐ │
│ │ [Search input field]                 │ │
│ └──────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Suppliers Grid (3 columns)              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │Supplier1 │ │Supplier2 │ │Supplier3 │ │
│ │Name      │ │Name      │ │Name      │ │
│ │Contact   │ │Contact   │ │Contact   │ │
│ │Address   │ │Address   │ │Address   │ │
│ │Products  │ │Products  │ │Products  │ │
│ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

**Features:**
- Card-based layout
- Edit/Delete buttons per card
- Products supplied list
- Contact information display

---

### Inventory Tracking (/inventory)
```
Header: "Inventory Tracking"

┌─────────────────────────────────────────┐
│ Search Card                              │
│ ┌──────────────────────────────────────┐ │
│ │ [Search input field]                 │ │
│ └──────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Inventory Cards (2 columns)             │
│ ┌──────────────────┐ ┌───────────────┐  │
│ │ Product 1        │ │ Product 2     │  │
│ │ [Stats Grid]     │ │ [Stats Grid]  │  │
│ │ Received │ Sold  │ │ Remaining    │  │
│ │ [Buttons]        │ │ [Buttons]     │  │
│ └──────────────────┘ │ Add/Record    │  │
│                      └───────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Detailed Inventory Table                │
│ ┌────────────────────────────────────┐  │
│ │ ID │ Name │ Received │ Sold │ Rem │  │
│ ├────────────────────────────────────┤  │
│ │ P1 │ ...  │ ...      │ ...  │ ... │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Features:**
- Inventory cards with statistics
- Add Stock button
- Record Sale button
- Detailed transaction table

---

## Modal Dialogs

### Product Modal
```
┌──────────────────────────────────┐
│ Add New Product          [X]     │
├──────────────────────────────────┤
│                                  │
│ Product ID:   [________________] │
│ Product Name: [________________] │
│ Category:     [Category Select]  │
│ Price:        [________________] │
│ Stock:        [________________] │
│ Supplier:     [Supplier Select]  │
│                                  │
│         [Cancel]  [Create]      │
└──────────────────────────────────┘
```

### Supplier Modal
```
┌──────────────────────────────────┐
│ Add New Supplier         [X]     │
├──────────────────────────────────┤
│                                  │
│ Supplier ID: [________________]  │
│ Name:        [________________]  │
│ Contact:     [________________]  │
│ Address:     [_________]         │
│              [_________]         │
│                                  │
│ Products Supplied:               │
│ ☐ Product 1                      │
│ ☐ Product 2                      │
│ ☐ Product 3                      │
│                                  │
│         [Cancel]  [Create]      │
└──────────────────────────────────┘
```

### Inventory Modal
```
┌──────────────────────────────────┐
│ Add Stock from Supplier  [X]     │
├──────────────────────────────────┤
│                                  │
│ Product: Organic Apples          │
│ Current Stock: 150 units         │
│                                  │
│ Quantity to Receive: [________]  │
│ Notes:       [_________]         │
│              [_________]         │
│                                  │
│ Summary:                         │
│ To Receive: 0 units              │
│ New Stock: 150 units             │
│                                  │
│         [Cancel]  [Add Stock]   │
└──────────────────────────────────┘
```

## Color System

- **Sidebar**: Primary green (#4a9d6f)
- **Buttons**: Primary green for actions
- **Accents**: Lighter green (#68b588) for secondary actions
- **Cards**: White with subtle shadows
- **Borders**: Light gray with green accents
- **Status Colors**:
  - Green: High stock (> 100)
  - Yellow: Medium stock (> 50)
  - Red: Low stock (≤ 50)

## Responsive Behavior

- **Desktop (1024px+)**: Full multi-column layouts
- **Tablet (768px)**: 2-column grids
- **Mobile (<768px)**: Single column stacked layout
- Sidebar remains visible on all screen sizes
