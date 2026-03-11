'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { mockSuppliers } from '@/lib/mock-data';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    supplier: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        supplier: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Pantry'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.id) newErrors.id = 'Product ID is required';
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Product saved:', formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Product ID</label>
            <Input
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={!!product}
              placeholder="e.g., P001"
              className={errors.id ? 'border-destructive' : ''}
            />
            {errors.id && <p className="text-xs text-destructive mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Organic Apples"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground ${errors.category ? 'border-destructive' : 'border-border'}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Price ($)</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Stock Quantity</label>
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className={errors.stock ? 'border-destructive' : ''}
            />
            {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Supplier</label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground ${errors.supplier ? 'border-destructive' : 'border-border'}`}
            >
              <option value="">Select a supplier</option>
              {mockSuppliers.map(supplier => (
                <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
              ))}
            </select>
            {errors.supplier && <p className="text-xs text-destructive mt-1">{errors.supplier}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
