'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { mockInventoryMovements, mockProducts } from '@/lib/mock-data';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'receive' | 'sell' | null;
  productId: string | null;
}

export function InventoryModal({
  isOpen,
  onClose,
  modalType,
  productId,
}: InventoryModalProps) {
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const product = mockProducts.find(p => p.id === productId);
  const currentInventory = mockInventoryMovements.find(m => m.productId === productId);

  useEffect(() => {
    setQuantity('');
    setNotes('');
    setErrors({});
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!quantity || parseInt(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const action = modalType === 'receive' ? 'Stock Added' : 'Sale Recorded';
      console.log(`${action}:`, {
        productId,
        quantity: parseInt(quantity),
        notes,
        type: modalType,
      });
      onClose();
    }
  };

  if (!isOpen || !modalType || !productId || !product) return null;

  const isReceive = modalType === 'receive';
  const title = isReceive ? 'Add Stock from Supplier' : 'Record Sale';
  const buttonText = isReceive ? 'Add Stock' : 'Record Sale';
  const icon = isReceive ? '📥' : '📤';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Info */}
          <div className="p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground mb-1">Product</p>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground mt-2">ID: {product.id}</p>
            {currentInventory && (
              <p className="text-sm text-muted-foreground mt-1">
                Current Stock: <span className="font-semibold text-foreground">{currentInventory.remaining}</span>
              </p>
            )}
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {isReceive ? 'Quantity to Receive' : 'Quantity Sold'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xl">{icon}</span>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity) {
                    setErrors(prev => ({ ...prev, quantity: '' }));
                  }
                }}
                placeholder="Enter quantity"
                className={`pl-10 ${errors.quantity ? 'border-destructive' : ''}`}
                min="1"
              />
            </div>
            {errors.quantity && (
              <p className="text-xs text-destructive mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this transaction..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground resize-none"
              rows={3}
            />
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-muted border border-border">
            <p className="text-xs text-muted-foreground mb-2">Summary:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>{isReceive ? 'To Receive:' : 'To Sell:'}</span>
                <span className="font-medium text-primary">
                  {quantity || '0'} {quantity === '1' ? 'unit' : 'units'}
                </span>
              </div>
              {currentInventory && (
                <div className="flex justify-between border-t border-border pt-1 mt-1">
                  <span>New Stock:</span>
                  <span className="font-medium">
                    {isReceive
                      ? (currentInventory.remaining + (parseInt(quantity) || 0))
                      : Math.max(0, currentInventory.remaining - (parseInt(quantity) || 0))
                    } units
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {buttonText}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
