'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { 
  Menu, 
  ChevronDown, 
  LogIn, 
  UserPlus, 
  Home, 
  LogOut, 
  Server,
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle
} from 'lucide-react';

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
            <div className="relative">
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
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              TSORE IAAS
            </span>
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
                      className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50 flex items-center space-x-2 ${
                        isActive(item.href) ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}

                {/* Notifications */}
                <Button variant="ghost" className="relative p-2 hover:bg-blue-50 rounded-full">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 hover:bg-blue-50 rounded-full pl-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user?.email ? user.email.charAt(0).toUpperCase() : ''}
                            </span>
                          </div>
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-700">{user?.email || ''}</span>
                          <span className="text-xs text-blue-600 font-medium">{user?.role || ''}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.email ? user.email.charAt(0).toUpperCase() : ''}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{user?.email || ''}</span>
                        <span className="text-xs text-gray-500">{user?.role || ''}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg my-1 text-gray-700">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg my-1 text-gray-700">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg my-1 text-gray-700">
                      <CreditCard className="h-4 w-4" />
                      <span>Facturation</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg my-1 text-gray-700">
                      <HelpCircle className="h-4 w-4" />
                      <span>Aide & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem 
                      onClick={() => logout()} 
                      className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-red-50 rounded-lg mt-1 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
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
                  <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white transition-all duration-200">
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
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full min-w-[280px] p-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.email ? user.email.charAt(0).toUpperCase() : ''}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{user?.email || ''}</span>
                        <span className="text-xs text-gray-500">{user?.role || ''}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {navigationItems
                      .filter(item => item.show)
                      .map(item => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href} className="flex items-center space-x-2 p-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logout()} 
                      className="flex items-center space-x-2 p-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Link href="/auth/login">
                        <Button variant="ghost" className="w-full justify-start">
                          <LogIn className="h-4 w-4 mr-2" />
                          Connexion
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-400">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Inscription
                        </Button>
                      </Link>
                    </div>
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