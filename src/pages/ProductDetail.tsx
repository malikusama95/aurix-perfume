import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/product/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useReviews, useAddReview } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Loader2, Heart, Star } from "lucide-react";
import { format } from "date-fns";
import { ScentPyramid } from "@/components/product/ScentPyramid";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = parseInt(id || "0");
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts = [] } = useRelatedProducts(productId, product?.category || "");
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const { data: wishlist = [] } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const isWishlisted = wishlist.some(item => item.product_id === productId);

  const { data: reviews = [] } = useReviews(productId);
  const addReview = useAddReview();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isHoveringRating, setIsHoveringRating] = useState(0);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist.mutate(
      { productId, isWishlisted },
      {
        onError: (err: any) => {
          if (err.message.includes("logged in")) {
            toast({
              title: "Login Required",
              description: "Please log in to add items to your wishlist.",
            });
            navigate("/auth");
          } else {
            toast({
              title: "Error",
              description: "Could not update wishlist. Please try again.",
              variant: "destructive",
            });
          }
        },
        onSuccess: (data) => {
          toast({
            title: data.action === 'added' ? "Added to Wishlist" : "Removed from Wishlist",
            description: `${product?.name} has been ${data.action} your wishlist.`,
          });
        }
      }
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview.mutate({ productId, rating, reviewText }, {
      onSuccess: () => {
        setReviewText("");
        setRating(5);
        toast({
          title: "Review Submitted",
          description: "Thank you for sharing your thoughts!",
        });
      },
      onError: (error) => {
        console.error("Review submission error:", error);
        toast({
          title: "Error",
          description: "Could not submit review. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <p className="mb-8">We couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  const handleQuantityChange = (newValue: number) => {
    if (newValue >= 1) {
      setQuantity(newValue);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAddedToCart(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center">
          <li>
            <Link to="/" className="text-gray-500 hover:text-perfume-purple">Home</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to="/products" className="text-gray-500 hover:text-perfume-purple">Perfumes</Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-800">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600 hover:text-red-500'}`} 
            />
          </button>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-serif mb-1 text-white">{product.name}</h1>
          <p className="text-gray-400 mb-4">{product.brand}</p>
          
          <div className="flex items-center text-perfume-gold mb-4">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
            <span className="ml-2 text-gray-400">({product.reviews} reviews)</span>
          </div>
          
          <p className="text-2xl font-medium mb-6 text-white">₹{product.price}</p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-white">Description</h3>
            <p className="text-gray-400">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-white">Size</h3>
            <p className="text-gray-400">{product.size.value}{product.size.unit}</p>
          </div>
          
          {/* Quantity Selector */}
          {!isAddedToCart && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-white">Quantity</h3>
              <div className="flex items-center bg-[#111111] border border-neutral-800 rounded-none w-32 h-10 text-white">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center border-r border-neutral-800 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="flex-grow text-center text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center border-l border-neutral-800"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mb-8">
            {!isAddedToCart ? (
              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full md:w-auto rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold h-12 px-8"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate("/cart")}
                  className="rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold h-12 px-8"
                >
                  <ShoppingCart className="mr-2" size={16} />
                  Go to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddedToCart(false)}
                  className="rounded-none border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold h-12 px-8"
                >
                  <Plus className="mr-2" size={16} />
                  Add More Items
                </Button>
              </div>
            )}
            
            {!product.inStock && (
              <p className="text-sm text-red-400 mt-2">This product is currently out of stock.</p>
            )}
          </div>
          
          {/* Additional Info Tabs */}
          <Tabs defaultValue="fragrance">
            <TabsList className="grid grid-cols-4 mb-4 bg-neutral-900 border border-neutral-800 rounded-none h-auto p-0">
              <TabsTrigger value="fragrance" className="data-[state=active]:bg-perfume-gold data-[state=active]:text-black text-gray-400 rounded-none px-4 py-3 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Fragrance Notes</TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-perfume-gold data-[state=active]:text-black text-gray-400 rounded-none px-4 py-3 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-perfume-gold data-[state=active]:text-black text-gray-400 rounded-none px-4 py-3 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-perfume-gold data-[state=active]:text-black text-gray-400 rounded-none px-4 py-3 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>
            <TabsContent value="fragrance" className="text-gray-400 min-h-[300px]">
              <ScentPyramid 
                topNotes={product.fragrance.topNotes}
                middleNotes={product.fragrance.middleNotes}
                baseNotes={product.fragrance.baseNotes}
              />
            </TabsContent>
            <TabsContent value="details" className="text-gray-400">
              <p className="mb-2"><span className="font-medium text-white">Category:</span> {product.category}</p>
              <p className="mb-2"><span className="font-medium text-white">Concentration:</span> Eau de Parfum</p>
              <p><span className="font-medium text-white">Origin:</span> France</p>
            </TabsContent>
            <TabsContent value="shipping" className="text-gray-400">
              <p className="mb-2">Free shipping on orders over ₹4000.</p>
              <p className="mb-2">Delivery within 2-5 business days.</p>
              <p>Returns accepted within 30 days of purchase.</p>
            </TabsContent>
            <TabsContent value="reviews" className="text-gray-400">
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-none">
                  <h4 className="font-medium mb-4 text-white uppercase tracking-widest text-sm">Write a Review</h4>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setIsHoveringRating(star)}
                        onMouseLeave={() => setIsHoveringRating(0)}
                      >
                        <Star className={`w-6 h-6 ${(isHoveringRating || rating) >= star ? 'fill-perfume-gold text-perfume-gold' : 'text-neutral-700'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this fragrance..."
                    className="mb-4 rounded-none bg-transparent border-neutral-700 text-white focus-visible:ring-perfume-gold placeholder:text-gray-600"
                  />
                  <Button type="submit" disabled={addReview.isPending} className="rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold px-6">
                    {addReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-none text-center">
                  <p className="mb-4 text-white">Please log in to leave a review.</p>
                  <Button asChild className="rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold px-8">
                    <Link to={`/auth?redirect=/products/${productId}`}>Log In</Link>
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review this fragrance!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-800 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-perfume-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-perfume-gold' : 'text-neutral-700'}`} />
                          ))}
                        </div>
                        <span className="font-medium text-white">
                          {review.profiles?.first_name} {review.profiles?.last_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-300">{review.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-neutral-800 pt-16">
          <h2 className="text-2xl font-serif mb-8 text-white">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
