'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Menu, ChevronDown, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'text-blue-600' : '';
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-blue-600"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">IAASFirecracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/virtual-machines"
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${isActive('/virtual-machines')}`}
                >
                  Virtual Machines
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 flex items-center space-x-2">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2">
                  <Link href="/auth/register">
                    <UserPlus className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open main menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
