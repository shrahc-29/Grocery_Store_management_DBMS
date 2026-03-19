'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Truck, AlertTriangle } from 'lucide-react';
import { mockDailySales } from '@/lib/mock-data';

const PRODUCTS_API  = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  : 'http://localhost:5000/api/products';
const SUPPLIERS_API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`
  : 'http://localhost:5000/api/suppliers';

const LOW_STOCK_THRESHOLD = 20;

const MOCK_PRODUCTS = [
  { product_id: 1, product_name: 'Organic Apples',    stock_quantity: 150 },
  { product_id: 2, product_name: 'Whole Wheat Bread', stock_quantity: 12  },
  { product_id: 3, product_name: 'Free Range Eggs',   stock_quantity: 80  },
  { product_id: 4, product_name: 'Broccoli',          stock_quantity: 5   },
  { product_id: 5, product_name: 'Greek Yogurt',      stock_quantity: 60  },
  { product_id: 6, product_name: 'Banana Bundle',     stock_quantity: 200 },
];

export default function Dashboard() {
  const [products,  setProducts]  = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, sRes] = await Promise.allSettled([
          axios.get(PRODUCTS_API),
          axios.get(SUPPLIERS_API),
        ]);
        setProducts(pRes.status  === 'fulfilled' ? pRes.value.data  : MOCK_PRODUCTS);
        setSuppliers(sRes.status === 'fulfilled' ? sRes.value.data  : []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalStock    = products.reduce((s, p) => s + (p.stock_quantity ?? p.stock ?? 0), 0);
  const lowStockItems = products.filter(p => (p.stock_quantity ?? p.stock ?? 0) < LOW_STOCK_THRESHOLD);

  // Build bar chart data from live products
  const stockChartData = products
    .slice(0, 8)
    .map(p => ({
      name: (p.product_name ?? p.name ?? '').split(' ').slice(0, 2).join(' '),
      value: p.stock_quantity ?? p.stock ?? 0,
    }));

  const CHART_COLORS = ['#4a9d6f', '#68b88a', '#3d8a5e', '#5aab7c', '#2e7a52', '#7cc49a', '#1f6b44', '#8ed4ae'];

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your grocery store management system</p>
      </div>

      {/* Low Stock Alert */}
      {!loading && lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/5 border border-destructive/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="font-semibold text-destructive">
              {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} running low on stock
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(p => (
              <span key={p.product_id} className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                {p.product_name ?? p.name} ({p.stock_quantity ?? p.stock} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>Product Types</span>
              <Package className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active products in inventory</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>Total Stock</span>
              <ShoppingCart className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total units in warehouse</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${lowStockItems.length > 0 ? 'border-l-destructive' : 'border-l-primary'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>Low Stock Items</span>
              <AlertTriangle className={`w-5 h-5 ${lowStockItems.length > 0 ? 'text-destructive' : 'text-primary'}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${lowStockItems.length > 0 ? 'text-destructive' : ''}`}>
              {loading ? '—' : lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Need restocking soon</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>Active Suppliers</span>
              <Truck className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : suppliers.length || 5}</div>
            <p className="text-xs text-muted-foreground mt-1">Supplier partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart — Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales This Week</CardTitle>
            <CardDescription>Sales trend over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} units`, 'Sales']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4a9d6f"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4a9d6f' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart — Stock Levels (live data) */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stock by Product</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : 'Live inventory levels — red bars are below threshold'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChartData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} units`, 'Stock']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stockChartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.value < LOW_STOCK_THRESHOLD ? '#ef4444' : CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
