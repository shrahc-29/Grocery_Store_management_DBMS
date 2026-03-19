'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search, Phone, MapPin, Mail, AlertTriangle } from 'lucide-react';
import { SupplierModal } from '@/components/supplier-modal';

const API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`
  : 'http://localhost:5000/api/suppliers';

const FALLBACK_SUPPLIERS = [
  { supplier_id: 1, supplier_name: 'Fresh Farms Co.', phone: '+1-555-0123', email: 'info@freshfarms.com', address: '123 Rural Lane, Farm City, CA 92000' },
  { supplier_id: 2, supplier_name: 'Local Bakery', phone: '+1-555-0456', email: 'orders@localbakery.com', address: '456 Main Street, Downtown, CA 92001' },
  { supplier_id: 3, supplier_name: 'Farm Direct', phone: '+1-555-0789', email: 'contact@farmdirect.com', address: '789 Countryside Rd, Rural Area, CA 92002' },
  { supplier_id: 4, supplier_name: 'Dairy Plus', phone: '+1-555-0321', email: 'sales@dairyplus.com', address: '321 Production Ave, Industrial Park, CA 92003' },
  { supplier_id: 5, supplier_name: 'Tropical Imports', phone: '+1-555-0654', email: 'imports@tropical.com', address: '654 Port Street, Trade Zone, CA 92004' },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);
  const [error, setError] = useState('');

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(API);
      setSuppliers(res.data);
      setError('');
    } catch {
      setError('Could not connect to backend. Showing sample data.');
      setSuppliers(FALLBACK_SUPPLIERS);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground mt-2">Manage your supplier network</p>
        </div>
        <Button
          onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSuppliers.map(supplier => (
          <Card key={supplier.supplier_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.supplier_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID #{supplier.supplier_id}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditingSupplier(supplier); setIsModalOpen(true); }}
                    className="text-primary hover:bg-primary/10"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(supplier.supplier_id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No suppliers found</p>
          </CardContent>
        </Card>
      )}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchSuppliers(); }}
        supplier={editingSupplier}
      />
    </div>
  );
}
