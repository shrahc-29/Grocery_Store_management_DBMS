'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Plus, Search, Eye, ShoppingBag, TrendingUp, Users, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';
import { CreateOrderModal } from '@/components/create-order-modal';
import { OrderDetailModal } from '@/components/order-detail-modal';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ORDERS_API = `${BASE}/api/orders`;

const FALLBACK_ORDERS = [
  { order_id: 1, customer_name: 'Alice Johnson', customer_id: 1, total_amount: '24.97', order_date: '2024-03-10T10:00:00.000Z' },
  { order_id: 2, customer_name: 'Bob Smith',     customer_id: 2, total_amount: '12.48', order_date: '2024-03-11T14:30:00.000Z' },
  { order_id: 3, customer_name: 'Carol Williams',customer_id: 3, total_amount: '38.45', order_date: '2024-03-12T09:15:00.000Z' },
];

export default function OrdersPage() {
  const [orders, setOrders]               = useState<any[]>([]);
  const [searchTerm, setSearchTerm]       = useState('');
  const [isCreateOpen, setIsCreateOpen]   = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(ORDERS_API);
      setOrders(res.data);
    } catch {
      setError('Could not connect to backend. Showing sample data.');
      setOrders(FALLBACK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() =>
    orders.filter(o =>
      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.order_id).includes(searchTerm)
    ), [orders, searchTerm]);

  // Summary stats
  const totalRevenue  = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
  const totalOrders   = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="p-8 bg-background min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage customer orders</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          New Order
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              Total Orders <ShoppingBag className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All time orders placed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              Total Revenue <TrendingUp className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '—' : `$${totalRevenue.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative sales value</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              Avg. Order Value <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '—' : `$${avgOrderValue.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per order average</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : `${filtered.length} order${filtered.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map(order => (
                  <TableRow key={order.order_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">
                      #ORD-{String(order.order_id).padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customer_name || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.order_date
                        ? new Date(order.order_date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${parseFloat(order.total_amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No orders match your search' : 'No orders yet — create the first one!'}
                    </p>
                    {!searchTerm && (
                      <Button className="mt-4 gap-2" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" /> New Order
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); fetchOrders(); }}
      />
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}