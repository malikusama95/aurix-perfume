import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const Categories = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { data: categories = [], isLoading } = useCategories();
  const { data: products = [] } = useProducts();

  const countFor = (slug: string) => products.filter((p) => p.category === slug).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-4">Fragrance Categories</h1>
        <p className="text-gray-400">
          Explore our exquisite collection of fragrances by category. Each category represents a distinct olfactory
          family with its own unique characteristics and emotional resonance.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`px-4 py-2 text-sm font-medium rounded-none ${
              view === "grid" ? "bg-perfume-gold text-black" : "bg-neutral-900 text-gray-400 hover:bg-neutral-800"
            } border border-neutral-800`}
          >
            Grid View
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-4 py-2 text-sm font-medium rounded-none ${
              view === "list" ? "bg-perfume-gold text-black" : "bg-neutral-900 text-gray-400 hover:bg-neutral-800"
            } border border-neutral-800`}
          >
            List View
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No categories available yet.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const count = countFor(category.slug);
            return (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="group">
                <Card className="h-full overflow-hidden bg-neutral-900 border-neutral-800 rounded-none hover:shadow-xl transition-shadow duration-300">
                  <div className="h-44 relative overflow-hidden">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${category.color || "bg-neutral-800"}`} />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-xl mb-2 text-white">{category.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                      </div>
                      <span className="bg-neutral-800 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-none whitespace-nowrap">
                        {count} {count === 1 ? "fragrance" : "fragrances"}
                      </span>
                    </div>
                    <span className="text-perfume-gold text-sm font-semibold uppercase tracking-widest group-hover:underline">
                      Browse {category.name} →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const count = countFor(category.slug);
            return (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="group">
                <Card className="overflow-hidden bg-neutral-900 border-neutral-800 rounded-none hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 relative flex-shrink-0 overflow-hidden">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full ${category.color || "bg-gray-100"}`} />
                      )}
                    </div>
                    <CardContent className="p-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-xl mb-2 text-white">{category.name}</h3>
                          <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                          <span className="text-perfume-gold text-sm font-semibold uppercase tracking-widest group-hover:underline">
                            Browse {category.name} →
                          </span>
                        </div>
                        <span className="bg-neutral-800 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-none whitespace-nowrap">
                          {count} {count === 1 ? "fragrance" : "fragrances"}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
