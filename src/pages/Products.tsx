import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";

type TypeFilter = "all" | "attar" | "perfume";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  
  // Floating filter state for mobile
  const [showFloatingFilter, setShowFloatingFilter] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't show floating button if we're near the top (where inline filter is visible)
      if (currentScrollY < 300) {
        setShowFloatingFilter(false);
      } 
      // Show when scrolling up
      else if (currentScrollY < lastScrollY - 10) { // adding a small threshold to avoid jitter
        setShowFloatingFilter(true);
      } 
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY + 10) {
        setShowFloatingFilter(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const { data: products = [], isLoading, error } = useProducts();
  const { data: dbCategories = [] } = useCategories();

  // Slugs grouped by type, from DB
  const slugsByType = useMemo(() => {
    const attar = new Set(dbCategories.filter(c => c.type === "attar").map(c => c.slug));
    const perfume = new Set(dbCategories.filter(c => c.type === "perfume").map(c => c.slug));
    return { attar, perfume };
  }, [dbCategories]);

  // Visible category pills depend on selected type
  const categories = useMemo(() => {
    const filtered = typeFilter === "all"
      ? dbCategories
      : dbCategories.filter(c => c.type === typeFilter);
    return ["all", ...filtered.map(c => c.slug)];
  }, [dbCategories, typeFilter]);

  // Gather all unique scent notes
  const allScentNotes = useMemo(() => {
    const notes = new Set<string>();
    products.forEach(p => {
      p.fragrance.topNotes.forEach(n => notes.add(n));
      p.fragrance.middleNotes.forEach(n => notes.add(n));
      p.fragrance.baseNotes.forEach(n => notes.add(n));
    });
    return Array.from(notes).sort();
  }, [products]);

  // Initialize state from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const typeParam = searchParams.get("type") as TypeFilter | null;
    setSelectedCategory(categoryParam || "all");
    if (typeParam === "attar" || typeParam === "perfume" || typeParam === "all") {
      setTypeFilter(typeParam);
    }
  }, [searchParams]);

  const handleTypeChange = (t: TypeFilter) => {
    setTypeFilter(t);
    setSelectedCategory("all");
    const next = new URLSearchParams(searchParams);
    if (t === "all") next.delete("type"); else next.set("type", t);
    next.delete("category");
    setSearchParams(next);
  };

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (category === "all") {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", category);
    }
    
    setSearchParams(newSearchParams);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description?.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Filter by type (Attar / Perfume) using the slugs in each group
    if (typeFilter !== "all") {
      const allowed = typeFilter === "attar" ? slugsByType.attar : slugsByType.perfume;
      result = result.filter(p => allowed.has(p.category));
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Check for featured filter from URL
    if (searchParams.get("featured") === "true") {
      result = result.filter(product => product.featured);
    }

    // Filter by selected notes
    if (selectedNotes.length > 0) {
      result = result.filter(product => {
        const productNotes = [
          ...product.fragrance.topNotes,
          ...product.fragrance.middleNotes,
          ...product.fragrance.baseNotes
        ];
        return selectedNotes.some(note => productNotes.includes(note));
      });
    }

    // Sort products
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep default order for featured products first
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, selectedCategory, typeFilter, slugsByType, sortOption, searchQuery, searchParams, selectedNotes]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-destructive">Failed to load products. Please try again.</p>
      </div>
    );
  }

  const filterContent = (
    <div className="flex flex-col gap-8">
      {/* Type selector: Attar vs Perfume */}
      <div>
        <h3 className="text-lg font-medium mb-3">Shop by Type</h3>
        <div className="flex flex-col gap-2">
          {([
            { value: "all", label: "All" },
            { value: "perfume", label: "Perfumes" },
            { value: "attar", label: "Attar" },
          ] as { value: TypeFilter; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTypeChange(opt.value)}
              className={`px-4 py-2 text-left rounded-none border text-sm font-medium transition-colors ${
                typeFilter === opt.value
                  ? "bg-perfume-gold text-black border-perfume-gold"
                  : "bg-neutral-900 text-gray-400 border-neutral-800 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 text-left rounded-none border text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-perfume-gold text-black border-perfume-gold"
                  : "bg-neutral-900 text-gray-400 border-neutral-800 hover:bg-neutral-800 hover:text-white"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scent Notes */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Scent Notes</h3>
          {selectedNotes.length > 0 && (
            <button 
              onClick={() => setSelectedNotes([])} 
              className="text-xs text-perfume-gold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="max-h-[240px] overflow-y-auto pr-2 flex flex-wrap gap-2 custom-scrollbar">
          {allScentNotes.map((note) => (
            <button
              key={note}
              className={`px-3 py-1.5 rounded-none text-xs transition-colors border ${
                selectedNotes.includes(note)
                  ? "bg-perfume-gold text-black border-perfume-gold"
                  : "bg-neutral-900 border-neutral-800 text-gray-400 hover:border-perfume-gold"
              }`}
              onClick={() => {
                setSelectedNotes(prev => 
                  prev.includes(note) 
                    ? prev.filter(n => n !== note)
                    : [...prev, note]
                );
              }}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-8">Our Fragrances</h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search fragrances by name, brand, or category..."
            className="pl-10 w-full bg-neutral-900 border-neutral-800 text-white placeholder:text-gray-500 rounded-none h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:flex w-full lg:w-1/4 flex-col gap-8">
          {filterContent}
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-medium text-gray-300">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Desktop Sorting */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-sm text-gray-400">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] bg-neutral-900 border-neutral-800 text-white rounded-none">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800 text-white rounded-none">
                  <SelectItem value="default" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Featured</SelectItem>
                  <SelectItem value="price-asc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Name: Z-A</SelectItem>
                  <SelectItem value="rating" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No products found for the selected filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setTypeFilter("all");
                  setSearchQuery("");
                  setSortOption("default");
                  setSelectedNotes([]);
                  setSearchParams({});
                }}
                className="mt-4 px-6 py-2 bg-perfume-gold text-black uppercase tracking-widest font-bold text-xs rounded-none hover:bg-yellow-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mobile Filter Button */}
      <div 
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-transform duration-300 ${
          showFloatingFilter ? 'translate-y-0' : 'translate-y-[150%]'
        }`}
      >
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 border border-neutral-300 text-black shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors">
              <SlidersHorizontal size={16} />
              Filter & Sort
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] bg-[#0A0A0A] border-t border-neutral-800 p-0 text-white rounded-t-2xl flex flex-col">
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-2xl font-serif text-white">Filter & Sort</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-8">
                {/* Mobile Sorting */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Sort By</h3>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white rounded-none">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white rounded-none">
                      <SelectItem value="default" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Featured</SelectItem>
                      <SelectItem value="price-asc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Name: A-Z</SelectItem>
                      <SelectItem value="name-desc" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Name: Z-A</SelectItem>
                      <SelectItem value="rating" className="focus:bg-neutral-800 focus:text-white cursor-pointer">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Regular Filters */}
                {filterContent}
              </div>
            </div>
            
            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-neutral-800 bg-[#0A0A0A] flex justify-between gap-4 mt-auto">
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                  setTypeFilter("all");
                  setSearchQuery("");
                  setSortOption("default");
                  setSelectedNotes([]);
                  setSearchParams({});
                }}
                className="px-4 py-3 border border-neutral-700 text-gray-300 w-1/2 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                Clear
              </button>
              {/* Note: In a real app we'd close the sheet here, but Radix SheetClose is needed. For simplicity we let the user tap outside or swipe down. */}
              <SheetTrigger asChild>
                <button className="px-4 py-3 bg-perfume-gold text-black w-1/2 text-sm font-bold uppercase tracking-wider rounded-none">
                  Apply
                </button>
              </SheetTrigger>
            </div>
          </SheetContent>
        </Sheet>
      </div>

    </div>
  );
};

export default Products;
