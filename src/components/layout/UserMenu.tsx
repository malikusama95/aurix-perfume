
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Package, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative flex items-center justify-center hover:bg-white/10 transition-colors h-10 w-10 rounded-full"
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-neutral-900 shadow-lg rounded-none border border-neutral-800 py-2 z-50 text-white">
        {user ? (
          <>
            <div className="px-4 py-3 text-sm font-medium border-b border-neutral-800">
              <p className="font-semibold text-white">My Account</p>
              <p className="text-xs text-neutral-400 mt-1 truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <DropdownMenuItem asChild className="px-4 py-2 hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer rounded-none">
                <Link to="/profile" className="w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
            </div>
            
            {isAdmin && (
              <>
                <DropdownMenuSeparator className="my-1 bg-neutral-800" />
                <div className="py-1">
                  <DropdownMenuItem asChild className="px-4 py-2 hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer rounded-none">
                    <Link to="/admin" className="w-full font-medium">Admin Hub</Link>
                  </DropdownMenuItem>
                </div>
              </>
            )}
            
            <DropdownMenuSeparator className="my-1 bg-neutral-800" />
            <div className="py-1">
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:text-red-300 focus:bg-red-900/20 cursor-pointer rounded-none"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </div>
          </>
        ) : (
          <DropdownMenuItem asChild className="px-4 py-2 hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer rounded-none">
            <Link to="/auth" className="w-full">Sign in</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
