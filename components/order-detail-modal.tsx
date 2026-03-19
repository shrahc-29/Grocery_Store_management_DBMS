'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, User, Calendar, Receipt, Loader2 } from 'lucide-react';

const BASE       = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ORDERS_API = `${BASE}/api/orders`;

interface OrderDetailModalProps {
  isOpen:  boolean;
  onClose: () => void;
  order:   any | null;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const [detail, setDetail]   = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !order) { setDetail(null); return; }
    setLoading(true);
    axios.get(`${ORDERS_API}/${order.order_id}`)
      .then(res => setDetail(res.data))
      .catch(() => {
        // Fallback: use data we already have from the list
        setDetail({ ...order, items: [] });
      })
      .finally(() => setLoading(false));
  }, [isOpen, order]);

  if (!order) return null;

  const items        = detail?.items || [];
  const totalAmount  = parseFloat(detail?.total_amount || order.total_amount || 0);
  const orderDate    = detail?.order_date || order.order_date;
  const customerName = detail?.customer_name || order.customer_name || '—';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Order #ORD-{String(order.order_id).padStart(4, '0')}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading order details...</span>
          </div>
        ) : (
          <div className="space-y-5 pt-2">

            {/* Order Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <User className="w-3.5 h-3.5" /> Customer
                </div>
                <p className="font-semibold text-sm">{customerName}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Date & Time
                </div>
                <p className="font-semibold text-sm">
                  {orderDate
                    ? new Date(orderDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })
                    : '—'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium mb-3">
                <Package className="w-4 h-4 text-primary" />
                Items Ordered
              </div>

              {items.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                  No item details available
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted text-xs font-medium text-muted-foreground">
                    <span className="col-span-5">Product</span>
                    <span className="col-span-2 text-center">Price</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right">Subtotal</span>
                  </div>

                  {/* Item rows */}
                  {items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center ${i < items.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <span className="col-span-5 font-medium">
                        {item.product_name || `Product #${item.product_id}`}
                      </span>
                      <span className="col-span-2 text-center text-muted-foreground">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                      <span className="col-span-2 text-center">
                        <span className="px-2 py-0.5 bg-secondary rounded-full text-xs font-medium">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="col-span-3 text-right font-semibold">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="font-semibold text-foreground">Order Total</span>
              <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}