'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import { ProductModal } from '@/components/product-modal';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  : 'http://localhost:5000/api/products';

const LOW_STOCK_THRESHOLD = 20;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      setError('Could not connect to backend. Showing mock data.');
      // Fallback to mock data when backend is unavailable
      setProducts([
        { product_id: 1, product_name: 'Organic Apples', category_id: 1, category_name: 'Fruits', price: 4.99, stock_quantity: 150, supplier: 'Fresh Farms Co.' },
        { product_id: 2, product_name: 'Whole Wheat Bread', category_id: 2, category_name: 'Bakery', price: 3.49, stock_quantity: 12, supplier: 'Local Bakery' },
        { product_id: 3, product_name: 'Free Range Eggs', category_id: 3, category_name: 'Dairy', price: 5.99, stock_quantity: 80, supplier: 'Farm Direct' },
        { product_id: 4, product_name: 'Broccoli', category_id: 4, category_name: 'Vegetables', price: 2.99, stock_quantity: 5, supplier: 'Fresh Farms Co.' },
        { product_id: 5, product_name: 'Greek Yogurt', category_id: 3, category_name: 'Dairy', price: 4.49, stock_quantity: 60, supplier: 'Dairy Plus' },
        { product_id: 6, product_name: 'Banana Bundle', category_id: 1, category_name: 'Fruits', price: 1.99, stock_quantity: 200, supplier: 'Tropical Imports' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Build category list from data (prefer category_name if available)
  const categories = useMemo(() => {
    const cats = products.map(p => p.category_name || String(p.category_id));
    return ['All', ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const catLabel = p.category_name || String(p.category_id);
      const matchesSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || catLabel === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const lowStockCount = products.filter(p => p.stock_quantity < LOW_STOCK_THRESHOLD).length;

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {lowStockCount > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <strong>{lowStockCount} product{lowStockCount > 1 ? 's' : ''}</strong>&nbsp;running low on stock (below {LOW_STOCK_THRESHOLD} units)
        </div>
      )}

      {/* Search & Filter */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Search & Filter</CardTitle></CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : `${filteredProducts.length} products found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <TableRow key={product.product_id}>
                    <TableCell className="font-medium text-primary">#{product.product_id}</TableCell>
                    <TableCell className="font-medium">{product.product_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.category_name || `Cat #${product.category_id}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${product.stock_quantity < LOW_STOCK_THRESHOLD ? 'text-destructive' : ''}`}>
                        {product.stock_quantity}
                        {product.stock_quantity < LOW_STOCK_THRESHOLD && (
                          <span className="ml-1 text-xs">(low)</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.supplier || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.product_id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchProducts(); }}
        product={editingProduct}
      />
    </div>
  );
}
