import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { X, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import clubLogo from "@/assets/club-logo.jpg";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-primary text-white h-screen border-none rounded-none top-0 translate-y-0">
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <img 
              src={clubLogo} 
              alt="Tshwane Sporting FC Logo" 
              className="h-8 w-8 rounded-full" 
            />
            <h2 className="text-xl font-bold">Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="py-4 px-4 flex flex-col space-y-4">
          {user && (
            <div className="mb-2 pb-4 border-b border-white/20">
              <p className="text-sm text-white/70">Logged in as</p>
              <p className="font-bold">{user.fullName}</p>
            </div>
          )}
          
          <Link 
            href="/" 
            className={`text-lg py-2 ${isActive('/') ? 'text-white font-medium' : 'text-white/80'}`}
            onClick={onClose}
          >
            Home
          </Link>
          
          <Link 
            href="/players" 
            className={`text-lg py-2 ${isActive('/players') ? 'text-white font-medium' : 'text-white/80'}`}
            onClick={onClose}
          >
            Players
          </Link>
          
          <Link 
            href="/gallery" 
            className={`text-lg py-2 ${isActive('/gallery') ? 'text-white font-medium' : 'text-white/80'}`}
            onClick={onClose}
          >
            Gallery
          </Link>
          
          <Link 
            href="/about" 
            className={`text-lg py-2 ${isActive('/about') ? 'text-white font-medium' : 'text-white/80'}`}
            onClick={onClose}
          >
            About
          </Link>
          
          {user?.isAdmin && (
            <>
              <Separator className="bg-white/20" />
              <Link 
                href="/admin" 
                className={`text-lg py-2 ${isActive('/admin') ? 'text-white font-medium' : 'text-white/80'}`}
                onClick={onClose}
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/players" 
                className={`text-lg py-2 ${isActive('/admin/players') ? 'text-white font-medium' : 'text-white/80'}`}
                onClick={onClose}
              >
                Player Management
              </Link>
              <Link 
                href="/admin/gallery" 
                className={`text-lg py-2 ${isActive('/admin/gallery') ? 'text-white font-medium' : 'text-white/80'}`}
                onClick={onClose}
              >
                Gallery Management
              </Link>
            </>
          )}
        </div>
        
        <div className="mt-auto p-4 border-t border-white/20">
          {user ? (
            <Button 
              variant="secondary" 
              className="w-full bg-secondary/90 hover:bg-secondary"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="w-full bg-white text-primary hover:bg-gray-100"
                  onClick={onClose}
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button
                  variant="secondary"
                  className="w-full bg-secondary/90 hover:bg-secondary"
                  onClick={onClose}
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
