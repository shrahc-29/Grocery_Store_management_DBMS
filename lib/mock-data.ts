export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  products: string[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  received: number;
  sold: number;
  remaining: number;
  date: string;
}

export const mockProducts: Product[] = [
  {
    id: "P001",
    name: "Organic Apples",
    category: "Fruits",
    price: 4.99,
    stock: 150,
    supplier: "Fresh Farms Co.",
  },
  {
    id: "P002",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 3.49,
    stock: 45,
    supplier: "Local Bakery",
  },
  {
    id: "P003",
    name: "Free Range Eggs",
    category: "Dairy",
    price: 5.99,
    stock: 80,
    supplier: "Farm Direct",
  },
  {
    id: "P004",
    name: "Broccoli",
    category: "Vegetables",
    price: 2.99,
    stock: 120,
    supplier: "Fresh Farms Co.",
  },
  {
    id: "P005",
    name: "Greek Yogurt",
    category: "Dairy",
    price: 4.49,
    stock: 60,
    supplier: "Dairy Plus",
  },
  {
    id: "P006",
    name: "Banana Bundle",
    category: "Fruits",
    price: 1.99,
    stock: 200,
    supplier: "Tropical Imports",
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: "S001",
    name: "Fresh Farms Co.",
    contact: "+1-555-0123",
    address: "123 Rural Lane, Farm City, CA 92000",
    products: ["P001", "P004"],
  },
  {
    id: "S002",
    name: "Local Bakery",
    contact: "+1-555-0456",
    address: "456 Main Street, Downtown, CA 92001",
    products: ["P002"],
  },
  {
    id: "S003",
    name: "Farm Direct",
    contact: "+1-555-0789",
    address: "789 Countryside Rd, Rural Area, CA 92002",
    products: ["P003"],
  },
  {
    id: "S004",
    name: "Dairy Plus",
    contact: "+1-555-0321",
    address: "321 Production Ave, Industrial Park, CA 92003",
    products: ["P005"],
  },
  {
    id: "S005",
    name: "Tropical Imports",
    contact: "+1-555-0654",
    address: "654 Port Street, Trade Zone, CA 92004",
    products: ["P006"],
  },
];

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "IM001",
    productId: "P001",
    productName: "Organic Apples",
    received: 50,
    sold: 30,
    remaining: 150,
    date: "2024-03-08",
  },
  {
    id: "IM002",
    productId: "P002",
    productName: "Whole Wheat Bread",
    received: 20,
    sold: 15,
    remaining: 45,
    date: "2024-03-08",
  },
  {
    id: "IM003",
    productId: "P003",
    productName: "Free Range Eggs",
    received: 40,
    sold: 25,
    remaining: 80,
    date: "2024-03-08",
  },
  {
    id: "IM004",
    productId: "P004",
    productName: "Broccoli",
    received: 60,
    sold: 35,
    remaining: 120,
    date: "2024-03-08",
  },
  {
    id: "IM005",
    productId: "P005",
    productName: "Greek Yogurt",
    received: 30,
    sold: 18,
    remaining: 60,
    date: "2024-03-08",
  },
  {
    id: "IM006",
    productId: "P006",
    productName: "Banana Bundle",
    received: 100,
    sold: 45,
    remaining: 200,
    date: "2024-03-08",
  },
];

export const mockDailySales = [
  { date: "Mon", sales: 240 },
  { date: "Tue", sales: 310 },
  { date: "Wed", sales: 280 },
  { date: "Thu", sales: 420 },
  { date: "Fri", sales: 580 },
  { date: "Sat", sales: 720 },
  { date: "Sun", sales: 450 },
];

export const mockStockLevels = [
  { name: "Organic Apples", value: 150 },
  { name: "Whole Wheat Bread", value: 45 },
  { name: "Free Range Eggs", value: 80 },
  { name: "Broccoli", value: 120 },
  { name: "Greek Yogurt", value: 60 },
  { name: "Banana Bundle", value: 200 },
];
