import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import MobileMenu from "./mobile-menu";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => location === path;

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src="https://i.postimg.cc/0Q8TKHdG/favicon.ico"
                alt="Tshwane Sporting FC Logo"
                className="h-12"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-heading font-bold">
                  Tshwane Sporting FC
                </h1>
                <p className="text-xs md:text-sm opacity-80">Est. 2020</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`font-medium transition duration-200 ${isActive('/') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                Home
              </a>
            </Link>
            <Link href="/players">
              <a className={`font-medium transition duration-200 ${isActive('/players') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                Players
              </a>
            </Link>
            <Link href="/gallery">
              <a className={`font-medium transition duration-200 ${isActive('/gallery') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                Gallery
              </a>
            </Link>
            <Link href="/about">
              <a className={`font-medium transition duration-200 ${isActive('/about') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                About
              </a>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-primary bg-white hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    {user.fullName.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem>
                        <Link href="/admin">
                          <span className="w-full">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth">
                  <Button variant="outline" className="text-primary bg-white hover:bg-gray-100">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button variant="secondary" className="bg-secondary text-white hover:bg-secondary/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </header>
  );
};
