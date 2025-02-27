'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Server,
  HardDrive,
  History,
  Key,
  Database,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Offres VM', href: '/admin/vm-offers', icon: Server },
  { name: 'Images Système', href: '/admin/system-images', icon: HardDrive },
  { name: 'Historique VM', href: '/admin/vm-history', icon: History },
  { name: 'Clés SSH', href: '/admin/ssh-keys', icon: Key },
  { name: 'Toutes les VMs', href: '/admin/all-vms', icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col w-64 bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
        <span className="text-xl font-semibold text-white">Administration</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          asChild
        >
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-2 py-2 text-sm font-medium rounded-md group',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
