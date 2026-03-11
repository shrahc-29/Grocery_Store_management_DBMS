'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockInventoryMovements } from '@/lib/mock-data';
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { InventoryModal } from '@/components/inventory-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ModalType = 'receive' | 'sell' | null;

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filteredMovements = useMemo(() => {
    return mockInventoryMovements.filter(movement =>
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddStock = (productId: string) => {
    setSelectedProduct(productId);
    setModalType('receive');
    setIsModalOpen(true);
  };

  const handleRecordSale = (productId: string) => {
    setSelectedProduct(productId);
    setModalType('sell');
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-background">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Inventory Tracking</h1>
        <p className="text-muted-foreground mt-2">Track stock movements and inventory levels</p>
      </div>

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

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredMovements.map(movement => (
          <Card key={movement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{movement.productName}</CardTitle>
              <CardDescription>{movement.productId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stock Statistics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Received</p>
                  <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {movement.received}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Sold</p>
                  <p className="text-xl font-bold text-destructive flex items-center justify-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    {movement.sold}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent">
                  <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                  <p className="text-xl font-bold text-accent-foreground">
                    {movement.remaining}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <p className="text-xs text-muted-foreground text-center">
                Last updated: {movement.date}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleAddStock(movement.productId)}
                  variant="outline"
                  className="flex-1 text-primary border-primary hover:bg-primary/10"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
                <Button
                  onClick={() => handleRecordSale(movement.productId)}
                  variant="outline"
                  className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Record Sale
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMovements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No inventory records found</p>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory Movements</CardTitle>
          <CardDescription>Summary of all stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="font-semibold">Product ID</TableHead>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold text-center">Received</TableHead>
                  <TableHead className="font-semibold text-center">Sold</TableHead>
                  <TableHead className="font-semibold text-center">Remaining</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length > 0 ? (
                  filteredMovements.map(movement => (
                    <TableRow key={movement.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-primary">{movement.productId}</TableCell>
                      <TableCell>{movement.productName}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                          <TrendingUp className="w-4 h-4" />
                          {movement.received}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded">
                          <TrendingDown className="w-4 h-4" />
                          {movement.sold}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{movement.remaining}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{movement.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No inventory movements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
        productId={selectedProduct}
      />
    </div>
  );
}
