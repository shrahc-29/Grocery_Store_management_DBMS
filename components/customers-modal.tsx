'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/customers`
  : 'http://localhost:5000/api/customers';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: any | null;
}

const emptyForm = { customer_name: '', phone: '', email: '' };

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const [form, setForm]             = useState(emptyForm);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        customer_name: customer.customer_name ?? '',
        phone:         customer.phone         ?? '',
        email:         customer.email         ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [customer, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = 'Customer name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        customer_name: form.customer_name.trim(),
        phone:         form.phone.trim()  || null,
        email:         form.email.trim()  || null,
      };
      if (customer) {
        await axios.put(`${API}/update/${customer.customer_id}`, payload);
      } else {
        await axios.post(`${API}/add`, payload);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err?.response?.data?.error || 'Failed to save customer' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errors.submit && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{errors.submit}</p>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="customer_name">Full Name *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="customer_name"
                name="customer_name"
                placeholder="e.g., Alice Johnson"
                value={form.customer_name}
                onChange={handleChange}
                className={`pl-9 ${errors.customer_name ? 'border-destructive' : ''}`}
                autoFocus
              />
            </div>
            {errors.customer_name && (
              <p className="text-xs text-destructive mt-1">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                placeholder="+1-555-0123"
                value={form.phone}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={form.email}
                onChange={handleChange}
                className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}