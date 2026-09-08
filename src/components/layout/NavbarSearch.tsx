import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface NavbarSearchProps {
  isMobile?: boolean;
  onClose?: () => void;
}
export const NavbarSearch = ({
  isMobile = false,
  onClose
}: NavbarSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      if (onClose) onClose();
    }
  };
  return <form onSubmit={handleSearch} className={isMobile ? "" : "hidden md:flex relative max-w-[200px] lg:max-w-[300px]"}>
      <div className="relative w-full">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? "size-[18px]" : "size-4"}`} />
        <input type="text" placeholder="Search fragrances..." className={`${isMobile ? "bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 rounded-none w-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-perfume-gold focus:border-perfume-gold transition-all" : "bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 rounded-none pl-10 pr-4 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-perfume-gold focus:border-perfume-gold transition-all"}`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>
    </form>;
};