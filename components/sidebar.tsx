'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, Truck, TrendingUp, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/suppliers', label: 'Suppliers', icon: Truck },
    { href: '/inventory', label: 'Inventory', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen flex flex-col p-6">
      <div className="mb-8 flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-sidebar-primary" />
        <h1 className="text-2xl font-bold text-sidebar-foreground">GroceryStore</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="text-xs text-sidebar-foreground opacity-60 pt-4 border-t border-sidebar-border">
        <p>© 2024 GroceryStore</p>
        <p>DBMS Project</p>
      </div>
    </aside>
  );
}
