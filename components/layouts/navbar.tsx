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
import { Menu, ChevronDown, LogIn, UserPlus, Home, LogOut, Server } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'text-blue-600' : '';
  };

  const navigationItems = user ? [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      show: true
    },
    {
      href: '/virtual-machines',
      label: 'Machines Virtuelles',
      icon: <Server className="h-4 w-4" />,
      show: true
    }
  ] : [];

  return (
    <nav className="bg-white border-b shadow-sm backdrop-blur-sm bg-white/80 sticky top-0 z-50 transition-all duration-200">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-blue-600 transform group-hover:scale-110 transition-transform duration-200"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200">IAASFirecracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user ? (
              <>
                {/* Navigation Links */}
                {navigationItems
                  .filter(item => item.show)
                  .map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md hover:bg-blue-50 flex items-center space-x-2 ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200">
                      <span className="text-sm font-medium">{user.email}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {user.role}
                      </span>
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2">
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200">
                    <LogIn className="h-4 w-4" />
                    <span>Connexion</span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
                    <UserPlus className="h-4 w-4" />
                    <span>Inscription</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    {navigationItems
                      .filter(item => item.show)
                      .map(item => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href} className="flex items-center space-x-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/" className="text-gray-700 hover:text-[#0066FF] transition-colors">
                        Home
                      </Link>
                      <Link href="/course" className="text-gray-700 hover:text-[#0066FF] transition-colors">
                        Course
                      </Link>
                      <Link href="/pricing" className="text-gray-700 hover:text-[#0066FF] transition-colors">
                        Pricing
                      </Link>
                      <Link href="/about" className="text-gray-700 hover:text-[#0066FF] transition-colors">
                        About Us
                      </Link>
                      <Link href="/Contact" className="text-gray-700 hover:text-[#0066FF] transition-colors">
                        Contact
                      </Link>
                      <Link href="/Help" className="text-black hover:text-[#0066FF] transition-colors">
                        <span>  Help  </span>
                      </Link>

                      <Link href="/auth/login" className="flex items-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Connexion</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Inscription</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
