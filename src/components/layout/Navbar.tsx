
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { NavbarSearch } from "./NavbarSearch";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { CartButton } from "./CartButton";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const Navbar = () => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const brandName = useSiteSetting('brand_name') || 'AURIX';

  useEffect(() => {
    // Close mobile menu when navigating or screen size changes
    setShowMobileMenu(false);
  }, [isMobile, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white transition-colors p-2">
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-serif text-[28px] font-bold tracking-[0.15em] text-white hover:text-neutral-200 transition-colors uppercase">{brandName}</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/products" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white uppercase transition-colors">
                Shop
              </Link>
              <Link to="/categories" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white uppercase transition-colors">
                Categories
              </Link>
              <Link to="/about" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white uppercase transition-colors">
                About
              </Link>
            </nav>
          )}

          {/* Search Form */}
          <NavbarSearch />

          {/* Icons */}
          <div className="flex items-center space-x-2">
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && <MobileMenu isOpen={showMobileMenu} onSignOut={handleSignOut} onClose={() => setShowMobileMenu(false)} />}
    </div>
  );
};

export default Navbar;
