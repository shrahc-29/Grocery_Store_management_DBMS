'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any | null;
}

export function SupplierModal({ isOpen, onClose, supplier }: SupplierModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contact: '',
    address: '',
    products: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        id: '',
        name: '',
        contact: '',
        address: '',
        products: [],
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.id) newErrors.id = 'Supplier ID is required';
    if (!formData.name) newErrors.name = 'Supplier name is required';
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Supplier saved:', formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-xl font-bold">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Supplier ID</label>
            <Input
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={!!supplier}
              placeholder="e.g., S001"
              className={errors.id ? 'border-destructive' : ''}
            />
            {errors.id && <p className="text-xs text-destructive mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Supplier Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Fresh Farms Co."
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contact Number</label>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="e.g., +1-555-0123"
              className={errors.contact ? 'border-destructive' : ''}
            />
            {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground resize-none ${errors.address ? 'border-destructive' : 'border-border'}`}
              rows={3}
            />
            {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Products Supplied</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockProducts.map(product => (
                <label key={product.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.products.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{product.id} - {product.name}</span>
                </label>
              ))}
            </div>
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
              {supplier ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
