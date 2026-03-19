'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { InventoryModal } from '@/components/inventory-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PRODUCTS_API  = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  : 'http://localhost:5000/api/products';
const INVENTORY_API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/inventory`
  : 'http://localhost:5000/api/inventory';

const LOW_STOCK = 20;

const FALLBACK: any[] = [
  { product_id: 1, product_name: 'Organic Apples',     stock_quantity: 150, total_sold: 30 },
  { product_id: 2, product_name: 'Whole Wheat Bread',  stock_quantity: 12,  total_sold: 15 },
  { product_id: 3, product_name: 'Free Range Eggs',    stock_quantity: 80,  total_sold: 25 },
  { product_id: 4, product_name: 'Broccoli',           stock_quantity: 5,   total_sold: 35 },
  { product_id: 5, product_name: 'Greek Yogurt',       stock_quantity: 60,  total_sold: 18 },
  { product_id: 6, product_name: 'Banana Bundle',      stock_quantity: 200, total_sold: 45 },
];

type ModalType = 'receive' | 'sell' | null;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(INVENTORY_API);
      setInventory(res.data);
    } catch {
      setError('Could not connect to backend. Showing sample data.');
      setInventory(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const filtered = useMemo(() =>
    inventory.filter(m =>
      m.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.product_id).includes(searchTerm)
    ), [inventory, searchTerm]);

  const openModal = (product: any, type: ModalType) => {
    setSelectedProduct(product);
    setModalType(type);
    setIsModalOpen(true);
  };

  const totalStock   = inventory.reduce((s, m) => s + (m.stock_quantity ?? m.remaining ?? 0), 0);
  const totalSold    = inventory.reduce((s, m) => s + (m.total_sold   ?? m.sold       ?? 0), 0);
  const lowStockList = inventory.filter(m => (m.stock_quantity ?? m.remaining ?? 0) < LOW_STOCK);

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-2">Track stock levels and movements</p>
        </div>
        <Button variant="outline" onClick={fetchInventory} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Units across all products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Units sold (all time)</p>
          </CardContent>
        </Card>
        <Card className={lowStockList.length > 0 ? 'border-destructive' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              Low Stock Alerts
              {lowStockList.length > 0 && <AlertTriangle className="w-4 h-4 text-destructive" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${lowStockList.length > 0 ? 'text-destructive' : 'text-green-600'}`}>
              {lowStockList.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Products below {LOW_STOCK} units</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Warning Panel */}
      {lowStockList.length > 0 && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Low Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockList.map(m => (
                <span key={m.product_id} className="px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full border border-destructive/20">
                  {m.product_name} — {m.stock_quantity ?? m.remaining} left
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filtered.map(item => {
          const stock = item.stock_quantity ?? item.remaining ?? 0;
          const sold  = item.total_sold    ?? item.sold       ?? 0;
          const isLow = stock < LOW_STOCK;
          return (
            <Card key={item.product_id} className={`hover:shadow-lg transition-shadow ${isLow ? 'border-destructive/40' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{item.product_name}</CardTitle>
                    <CardDescription>Product #{item.product_id}</CardDescription>
                  </div>
                  {isLow && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full border border-destructive/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Total Sold</p>
                    <p className="text-xl font-bold text-destructive flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4" />{sold}
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${isLow ? 'bg-destructive/10' : 'bg-accent/20'}`}>
                    <p className="text-xs text-muted-foreground mb-1">In Stock</p>
                    <p className={`text-xl font-bold flex items-center justify-center gap-1 ${isLow ? 'text-destructive' : 'text-primary'}`}>
                      {stock}
                    </p>
                  </div>
                </div>

                {/* Stock progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Stock Level</span>
                    <span>{stock} units</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLow ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${Math.min(100, (stock / Math.max(stock + sold, 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-primary border-primary hover:bg-primary/10"
                    onClick={() => openModal(item, 'receive')}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" /> Add Stock
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => openModal(item, 'sell')}
                  >
                    <TrendingDown className="w-4 h-4 mr-1" /> Record Sale
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No inventory records found
          </CardContent>
        </Card>
      )}

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory Table</CardTitle>
          <CardDescription>Full summary of all products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>#</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-center">Total Sold</TableHead>
                <TableHead className="text-center">In Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading inventory...</TableCell>
                </TableRow>
              ) : filtered.map(item => {
                const stock = item.stock_quantity ?? item.remaining ?? 0;
                const sold  = item.total_sold    ?? item.sold       ?? 0;
                const isLow = stock < LOW_STOCK;
                return (
                  <TableRow key={item.product_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">#{item.product_id}</TableCell>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-sm">
                        <TrendingDown className="w-3 h-3" />{sold}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-700'}`}>
                        {stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {isLow ? (
                        <span className="text-xs text-destructive font-medium flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">OK</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                          onClick={() => openModal(item, 'receive')}>
                          <TrendingUp className="w-3 h-3 mr-1" />Add
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                          onClick={() => openModal(item, 'sell')}>
                          <TrendingDown className="w-3 h-3 mr-1" />Sell
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchInventory(); }}
        modalType={modalType}
        product={selectedProduct}
        onSuccess={fetchInventory}
      />
    </div>
  );
}
