
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const Footer = () => {
  const brandName = useSiteSetting('brand_name') || 'AURIX';
  const footerCopyright = useSiteSetting('footer_copyright');
  // Hardcoded to strictly use this link, overriding any database settings just in case
  const facebookUrl = 'https://www.facebook.com/aurixperfume25/';
  const instagramUrl = useSiteSetting('social_instagram') || '#';
  const twitterUrl = useSiteSetting('social_twitter') || '#';
  const emailAddress = useSiteSetting('contact_email') || 'aurixperfume25@gmail.com';
  
  return (
    <footer className="bg-[#0A0A0A] pt-12 pb-8 border-t border-neutral-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="col-span-1">
            <Link to="/" className="font-serif text-[28px] font-bold tracking-[0.15em] text-white uppercase">
              {brandName}
            </Link>
            <p className="mt-4 text-gray-400">
              Experience the art of luxury fragrances, crafted to capture moments and memories in every bottle.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 mt-5">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={`mailto:${emailAddress}`} aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg font-medium mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">All Perfumes</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-gray-400 hover:text-white transition-colors">Featured</Link>
              </li>
              <li>
                <Link to="/products?new=true" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-serif text-lg font-medium mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-serif text-lg font-medium mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-gray-400 hover:text-white transition-colors">Order Tracking</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-900 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">{footerCopyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}</p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">Payment Methods: Visa, Mastercard, PayPal, Apple Pay</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
