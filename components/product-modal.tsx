'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API           = `${BASE_URL}/api/products`;
const CATEGORIES_API = `${BASE_URL}/api/categories`;
const SUPPLIERS_API  = `${BASE_URL}/api/suppliers`;

// Fallback data when backend is unavailable
const FALLBACK_CATEGORIES = [
  { category_id: 1, category_name: 'Fruits' },
  { category_id: 2, category_name: 'Bakery' },
  { category_id: 3, category_name: 'Dairy' },
  { category_id: 4, category_name: 'Vegetables' },
  { category_id: 5, category_name: 'Beverages' },
];

const FALLBACK_SUPPLIERS = [
  { supplier_id: 1, supplier_name: 'Fresh Farms Co.' },
  { supplier_id: 2, supplier_name: 'Local Bakery' },
  { supplier_id: 3, supplier_name: 'Farm Direct' },
  { supplier_id: 4, supplier_name: 'Dairy Plus' },
  { supplier_id: 5, supplier_name: 'Tropical Imports' },
];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any | null;
}

const emptyForm = {
  product_name: '',
  category_id: '',
  price: '',
  stock_quantity: '',
  supplier: '',
};

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers]   = useState<any[]>([]);

  // Load categories and suppliers when modal opens
  useEffect(() => {
    if (!isOpen) return;

    axios.get(CATEGORIES_API)
      .then(res => setCategories(res.data))
      .catch(() => setCategories(FALLBACK_CATEGORIES));

    axios.get(SUPPLIERS_API)
      .then(res => setSuppliers(res.data))
      .catch(() => setSuppliers(FALLBACK_SUPPLIERS));
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        product_name:   product.product_name     ?? '',
        category_id:    String(product.category_id ?? ''),
        price:          String(product.price        ?? ''),
        stock_quantity: String(product.stock_quantity ?? ''),
        supplier:       product.supplier          ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.product_name.trim())  e.product_name  = 'Product name is required';
    if (!form.category_id)          e.category_id   = 'Category is required';
    if (!form.supplier)             e.supplier      = 'Supplier is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Valid price is required';
    if (!form.stock_quantity || isNaN(Number(form.stock_quantity)) || Number(form.stock_quantity) < 0)
      e.stock_quantity = 'Valid stock quantity is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        product_name:   form.product_name,
        category_id:    Number(form.category_id) || null,
        price:          Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        supplier:       form.supplier,
      };
      if (product) {
        await axios.put(`${API}/update/${product.product_id}`, payload);
      } else {
        await axios.post(`${API}/add`, payload);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err?.response?.data?.error || 'Failed to save product' });
    } finally {
      setSubmitting(false);
    }
  };

  // Shared select styles
  const selectClass = (hasError?: boolean) =>
    `w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
      hasError ? 'border-destructive' : 'border-input'
    }`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errors.submit && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{errors.submit}</p>
          )}

          {/* Product Name */}
          <div>
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              name="product_name"
              placeholder="e.g., Organic Apples"
              value={form.product_name}
              onChange={handleChange}
              className={errors.product_name ? 'border-destructive' : ''}
            />
            {errors.product_name && <p className="text-xs text-destructive mt-1">{errors.product_name}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <Label htmlFor="category_id">Category *</Label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={selectClass(!!errors.category_id)}
            >
              <option value="">— Select a category —</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-destructive mt-1">{errors.category_id}</p>}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Qty *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                placeholder="0"
                value={form.stock_quantity}
                onChange={handleChange}
                type="number"
                min="0"
                className={errors.stock_quantity ? 'border-destructive' : ''}
              />
              {errors.stock_quantity && <p className="text-xs text-destructive mt-1">{errors.stock_quantity}</p>}
            </div>
          </div>

          {/* Supplier Dropdown */}
          <div>
            <Label htmlFor="supplier">Supplier *</Label>
            <select
              id="supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className={selectClass(!!errors.supplier)}
            >
              <option value="">— Select a supplier —</option>
              {suppliers.map(s => (
                <option key={s.supplier_id} value={s.supplier_name}>
                  {s.supplier_name}
                </option>
              ))}
            </select>
            {errors.supplier && <p className="text-xs text-destructive mt-1">{errors.supplier}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}