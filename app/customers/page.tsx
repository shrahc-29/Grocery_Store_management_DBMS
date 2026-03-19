'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Plus, Search, Edit2, Trash2, Phone, Mail, Users, AlertTriangle
} from 'lucide-react';
import { CustomerModal } from '@/components/customers-modal';

const API = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/customers`
  : 'http://localhost:5000/api/customers';

const FALLBACK_CUSTOMERS = [
  { customer_id: 1, customer_name: 'Alice Johnson',  phone: '+1-555-1001', email: 'alice@email.com',  created_at: '2024-01-10' },
  { customer_id: 2, customer_name: 'Bob Smith',      phone: '+1-555-1002', email: 'bob@email.com',    created_at: '2024-01-12' },
  { customer_id: 3, customer_name: 'Carol Williams', phone: '+1-555-1003', email: 'carol@email.com',  created_at: '2024-01-15' },
];

export default function CustomersPage() {
  const [customers, setCustomers]             = useState<any[]>([]);
  const [searchTerm, setSearchTerm]           = useState('');
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API);
      setCustomers(res.data);
    } catch {
      setError('Could not connect to backend. Showing sample data.');
      setCustomers(FALLBACK_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete customer "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchCustomers();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete customer');
    }
  };

  const filtered = useMemo(() =>
    customers.filter(c =>
      c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [customers, searchTerm]);

  return (
    <div className="p-8 bg-background min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-2">Manage your customer records</p>
        </div>
        <Button
          onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              Total Customers <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              With Phone <Phone className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '—' : customers.filter(c => c.phone).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contactable by phone</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
              With Email <Mail className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '—' : customers.filter(c => c.email).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Contactable by email</p>
          </CardContent>
        </Card>
      </div>

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

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {!loading && filtered.map(customer => (
          <Card key={customer.customer_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{customer.customer_name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">ID #{customer.customer_id}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost"
                    className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    onClick={() => { setEditingCustomer(customer); setIsModalOpen(true); }}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    onClick={() => handleDelete(customer.customer_id, customer.customer_name)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className={customer.phone ? '' : 'text-muted-foreground'}>
                  {customer.phone || 'No phone'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className={`truncate ${customer.email ? '' : 'text-muted-foreground'}`}>
                  {customer.email || 'No email'}
                </span>
              </div>
              {customer.created_at && (
                <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                  Added: {new Date(customer.created_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <Card className="mb-8">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No customers match your search' : 'No customers yet — add your first one!'}
            </p>
            {!searchTerm && (
              <Button className="mt-4 gap-2"
                onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}>
                <Plus className="w-4 h-4" /> Add Customer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : `${filtered.length} customer${filtered.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filtered.length > 0 ? (
                filtered.map(customer => (
                  <TableRow key={customer.customer_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">#{customer.customer_id}</TableCell>
                    <TableCell className="font-medium">{customer.customer_name}</TableCell>
                    <TableCell className="text-sm">
                      {customer.phone
                        ? <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{customer.phone}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.email
                        ? <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{customer.email}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10"
                          onClick={() => { setEditingCustomer(customer); setIsModalOpen(true); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(customer.customer_id, customer.customer_name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchCustomers(); }}
        customer={editingCustomer}
      />
    </div>
  );
}