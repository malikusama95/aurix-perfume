
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { NavbarSearch } from "./NavbarSearch";

interface MobileMenuProps {
  isOpen: boolean;
  onSignOut: () => Promise<void>;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onSignOut, onClose }: MobileMenuProps) => {
  const { user, isAdmin } = useAuth();
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-[#0A0A0A] border-b border-neutral-800 shadow-xl">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Search */}
        <div className="mb-6">
          <NavbarSearch isMobile onClose={onClose} />
        </div>
        
        {/* Mobile Nav Links */}
        <nav className="flex flex-col space-y-2">
          <Link to="/products" onClick={onClose} className="text-white hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 font-bold uppercase tracking-widest text-xs">
            Shop
          </Link>
          <Link to="/categories" onClick={onClose} className="text-white hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 font-bold uppercase tracking-widest text-xs">
            Categories
          </Link>
          <Link to="/about" onClick={onClose} className="text-white hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 font-bold uppercase tracking-widest text-xs">
            About
          </Link>
          
          {user && (
            <>
              <div className="border-t border-neutral-800 my-2"></div>
              <Link to="/profile" onClick={onClose} className="text-gray-300 hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 flex items-center text-sm font-medium">
                My Profile
              </Link>
            </>
          )}
          
          {isAdmin && (
            <>
              <div className="border-t border-neutral-800 my-2"></div>
              <Link to="/admin" onClick={onClose} className="text-gray-300 hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 flex items-center text-sm font-medium">
                Admin Hub
              </Link>
            </>
          )}
          
          {user ? (
            <>
              <div className="border-t border-neutral-800 my-2"></div>
              <Button 
                onClick={() => {
                  onClose();
                  onSignOut();
                }} 
                variant="ghost" 
                className="justify-start p-3 h-auto text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-none text-sm font-medium w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <div className="border-t border-neutral-800 my-2"></div>
              <Link to="/auth" onClick={onClose} className="text-gray-300 hover:text-perfume-gold transition-colors py-3 px-3 rounded-none hover:bg-neutral-900 text-sm font-medium flex items-center">
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
