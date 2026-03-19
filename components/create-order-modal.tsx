'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ShoppingCart, User, Package } from 'lucide-react';

const BASE             = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ORDERS_API       = `${BASE}/api/orders`;
const CUSTOMERS_API    = `${BASE}/api/customers`;
const PRODUCTS_API     = `${BASE}/api/products`;

interface OrderItem {
  product_id:   number;
  product_name: string;
  price:        number;
  quantity:     number;
  stock:        number;
}

interface CreateOrderModalProps {
  isOpen:   boolean;
  onClose:  () => void;
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const [customers, setCustomers]       = useState<any[]>([]);
  const [products,  setProducts]        = useState<any[]>([]);
  const [customerId, setCustomerId]     = useState('');
  const [items, setItems]               = useState<OrderItem[]>([]);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [submitting, setSubmitting]     = useState(false);

  // Load customers + products when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setCustomerId('');
    setItems([]);
    setErrors({});

    axios.get(CUSTOMERS_API).then(r => setCustomers(r.data)).catch(() => setCustomers([]));
    axios.get(PRODUCTS_API).then(r => setProducts(r.data)).catch(() => setProducts([]));
  }, [isOpen]);

  // Add a blank item row
  const addItem = () => {
    setItems(prev => [...prev, { product_id: 0, product_name: '', price: 0, quantity: 1, stock: 0 }]);
  };

  // When user selects a product in a row
  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.product_id === parseInt(productId));
    if (!product) return;
    setItems(prev => prev.map((item, i) =>
      i === index
        ? { product_id: product.product_id, product_name: product.product_name,
            price: parseFloat(product.price), quantity: 1, stock: product.stock_quantity }
        : item
    ));
  };

  // When user changes quantity
  const handleQtyChange = (index: number, value: string) => {
    const qty = parseInt(value) || 1;
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  };

  // Remove an item row
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerId)        e.customer  = 'Please select a customer';
    if (items.length === 0) e.items     = 'Add at least one product';
    items.forEach((item, i) => {
      if (!item.product_id)         e[`item_${i}`] = 'Select a product';
      else if (item.quantity < 1)   e[`item_${i}`] = 'Quantity must be at least 1';
      else if (item.quantity > item.stock)
        e[`item_${i}`] = `Only ${item.stock} in stock`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post(`${ORDERS_API}/create`, {
        customer_id:  parseInt(customerId),
        total_amount: totalAmount,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity:   item.quantity,
          price:      item.price,
        })),
      });
      onClose();
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.error || 'Failed to create order' });
    } finally {
      setSubmitting(false);
    }
  };

  // Products already added (to avoid duplicates in dropdown)
  const addedProductIds = items.map(i => i.product_id).filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Create New Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {errors.submit && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{errors.submit}</p>
          )}

          {/* Customer Select */}
          <div>
            <Label htmlFor="customer" className="flex items-center gap-1.5 mb-1">
              <User className="w-4 h-4" /> Customer *
            </Label>
            <select
              id="customer"
              value={customerId}
              onChange={e => { setCustomerId(e.target.value); setErrors(p => ({ ...p, customer: '' })); }}
              className={`w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.customer ? 'border-destructive' : 'border-input'}`}
            >
              <option value="">— Select a customer —</option>
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.customer_name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
            {errors.customer && <p className="text-xs text-destructive mt-1">{errors.customer}</p>}
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center gap-1.5">
                <Package className="w-4 h-4" /> Products *
              </Label>
              <Button type="button" size="sm" variant="outline" onClick={addItem} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            </div>

            {errors.items && <p className="text-xs text-destructive mb-2">{errors.items}</p>}

            {items.length === 0 ? (
              <div
                onClick={addItem}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to add a product to this order</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 px-1">
                  <span className="col-span-5 text-xs font-medium text-muted-foreground">Product</span>
                  <span className="col-span-2 text-xs font-medium text-muted-foreground text-center">Stock</span>
                  <span className="col-span-2 text-xs font-medium text-muted-foreground text-center">Price</span>
                  <span className="col-span-2 text-xs font-medium text-muted-foreground text-center">Qty</span>
                  <span className="col-span-1"></span>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-secondary/50 rounded-lg border border-border">
                    {/* Product dropdown */}
                    <div className="col-span-5">
                      <select
                        value={item.product_id || ''}
                        onChange={e => { handleProductSelect(index, e.target.value); setErrors(p => ({ ...p, [`item_${index}`]: '' })); }}
                        className={`w-full px-2 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors[`item_${index}`] ? 'border-destructive' : 'border-input'}`}
                      >
                        <option value="">— Select —</option>
                        {products
                          .filter(p => !addedProductIds.includes(p.product_id) || p.product_id === item.product_id)
                          .map(p => (
                            <option key={p.product_id} value={p.product_id} disabled={p.stock_quantity === 0}>
                              {p.product_name} {p.stock_quantity === 0 ? '(Out of stock)' : ''}
                            </option>
                          ))}
                      </select>
                      {errors[`item_${index}`] && (
                        <p className="text-xs text-destructive mt-0.5">{errors[`item_${index}`]}</p>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="col-span-2 text-center">
                      <span className={`text-sm font-medium ${item.stock > 0 && item.stock < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {item.product_id ? item.stock : '—'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium">
                        {item.product_id ? `$${item.price.toFixed(2)}` : '—'}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={e => handleQtyChange(index, e.target.value)}
                        disabled={!item.product_id}
                        className="h-8 text-center text-sm"
                      />
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:bg-destructive/10 rounded p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-muted rounded-lg border border-border space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-xs mb-3">Order Summary</p>
              {items.filter(i => i.product_id).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting || items.length === 0}>
              {submitting ? 'Placing Order...' : `Place Order • $${totalAmount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}