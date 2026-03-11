'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProducts, mockSuppliers, mockDailySales, mockStockLevels } from '@/lib/mock-data';
import { Package, ShoppingCart, TrendingUp, Truck } from 'lucide-react';

export default function Dashboard() {
  const totalProductTypes = mockProducts.length;
  const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalSuppliers = mockSuppliers.length;
  const dailySales = 245; // Today's sales

  const COLORS = ['#4a9d6f', '#68b588', '#a8d5ba', '#c4e8d8', '#e8f5f0', '#d4e8db'];

  return (
    <div className="p-8 bg-background">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your grocery store management system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Product Types</span>
              <Package className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalProductTypes}</div>
            <p className="text-xs text-muted-foreground mt-1">Active products in inventory</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Stock</span>
              <ShoppingCart className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Total units in stock</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Sold Today</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{dailySales}</div>
            <p className="text-xs text-muted-foreground mt-1">Units sold</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Active Suppliers</span>
              <Truck className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground mt-1">Supplier partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales This Week</CardTitle>
            <CardDescription>Sales trend over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockDailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}
                  formatter={(value) => [`${value} units`, 'Sales']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4a9d6f" 
                  strokeWidth={2}
                  dot={{ fill: '#4a9d6f', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Levels Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels by Product</CardTitle>
            <CardDescription>Current inventory for all products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockStockLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}
                  formatter={(value) => [`${value} units`, 'Stock']}
                />
                <Legend />
                <Bar dataKey="value" fill="#4a9d6f" name="Stock" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
