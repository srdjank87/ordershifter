// app/dashboard/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Package, Store, Warehouse, Settings } from 'lucide-react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-base-100 border-r border-base-300">
        <div className="h-16 flex items-center px-4 border-b border-base-300">
          <span className="font-bold text-lg">
            Order<span className="text-primary">Shifter</span>
          </span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavItem href="/dashboard" icon={<Home size={16} />}>
            Overview
          </NavItem>
          <NavItem href="/dashboard/orders" icon={<Package size={16} />} disabled>
            Orders
          </NavItem>
          <NavItem href="/dashboard/merchants" icon={<Store size={16} />} disabled>
            Merchants
          </NavItem>
          <NavItem href="/dashboard/warehouses" icon={<Warehouse size={16} />} disabled>
            Warehouses
          </NavItem>
          <NavItem href="/dashboard/settings" icon={<Settings size={16} />} disabled>
            Settings
          </NavItem>
        </nav>

        <div className="px-4 py-3 border-t border-base-300 text-xs opacity-70">
          Logged in as <span className="font-semibold">3PL Admin</span>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top nav */}
        <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 md:hidden">
            <span className="font-semibold">
              Order<span className="text-primary">Shifter</span>
            </span>
            <span className="text-xs opacity-70">Dashboard</span>
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold">3PL Admin Dashboard</span>
            <span className="text-xs opacity-70">
              Monitor orders flowing between Shopify and your WMS.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-xs">Help</button>
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-7 rounded-full text-xs">
                <span>AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
};

function NavItem({ href, icon, children, disabled }: NavItemProps) {
  const content = (
    <div
      className={[
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:bg-base-200 cursor-pointer',
      ].join(' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {disabled && (
        <span className="ml-auto text-[10px] uppercase tracking-wide">
          Soon
        </span>
      )}
    </div>
  );

  if (disabled) {
    return <div className="text-base-content/70">{content}</div>;
  }

  return (
    <Link href={href} className="block text-base-content">
      {content}
    </Link>
  );
}
