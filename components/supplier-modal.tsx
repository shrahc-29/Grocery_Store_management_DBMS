'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`
  : 'http://localhost:5000/api/suppliers';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any | null;
}

const emptyForm = { supplier_name: '', phone: '', email: '', address: '' };

export function SupplierModal({ isOpen, onClose, supplier }: SupplierModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (supplier) {
      setForm({
        supplier_name: supplier.supplier_name ?? '',
        phone:         supplier.phone         ?? '',
        email:         supplier.email         ?? '',
        address:       supplier.address       ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.supplier_name.trim()) e.supplier_name = 'Supplier name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (supplier) {
        await axios.put(`${API}/update/${supplier.supplier_id}`, form);
      } else {
        await axios.post(`${API}/add`, form);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err?.response?.data?.error || 'Failed to save supplier' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errors.submit && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{errors.submit}</p>
          )}

          <div>
            <Label htmlFor="supplier_name">Supplier Name *</Label>
            <Input
              id="supplier_name"
              name="supplier_name"
              placeholder="e.g., Fresh Farms Co."
              value={form.supplier_name}
              onChange={handleChange}
              className={errors.supplier_name ? 'border-destructive' : ''}
            />
            {errors.supplier_name && <p className="text-xs text-destructive mt-1">{errors.supplier_name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+1-555-0123"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="supplier@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full address"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : supplier ? 'Update' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
