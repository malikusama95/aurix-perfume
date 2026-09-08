
import { Product } from "../types";

export const products: Product[] = [
  {
    id: 1,
    name: "Ethereal Bloom",
    brand: "Scent Trail",
    description: "A captivating blend of delicate florals with subtle woody undertones. This enchanting fragrance opens with fresh bergamot and lily of the valley, transitioning to a heart of rose and jasmine, before settling into a warm base of sandalwood and amber.",
    price: 9600,
    image: "/perfume1.jpg",
    category: "floral",
    featured: true,
    inStock: true,
    rating: 4.8,
    reviews: 124,
    fragrance: {
      topNotes: ["Bergamot", "Lily of the Valley"],
      middleNotes: ["Rose", "Jasmine"],
      baseNotes: ["Sandalwood", "Amber"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  },
  {
    id: 2,
    name: "Midnight Velvet",
    brand: "Scent Trail",
    description: "An intoxicating oriental fragrance that captivates with its rich and mysterious character. Beginning with spicy black pepper and cardamom, it unfolds into a heart of sensual vanilla and exotic oud, finally revealing a lasting impression of musk and patchouli.",
    price: 10800,
    image: "/perfume2.jpg",
    category: "oriental",
    featured: true,
    inStock: true,
    rating: 4.7,
    reviews: 98,
    fragrance: {
      topNotes: ["Black Pepper", "Cardamom"],
      middleNotes: ["Vanilla", "Oud"],
      baseNotes: ["Musk", "Patchouli"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  },
  {
    id: 3,
    name: "Citrus Awakening",
    brand: "Scent Trail",
    description: "A refreshing and invigorating blend that brings to life the essence of sun-drenched citrus groves. Sparkling notes of lemon and grapefruit create an energizing opening, followed by aromatic rosemary and mint heart notes, finishing with a light cedar and vetiver base.",
    price: 7600,
    image: "/perfume3.jpg",
    category: "citrus",
    featured: false,
    inStock: true,
    rating: 4.5,
    reviews: 76,
    fragrance: {
      topNotes: ["Lemon", "Grapefruit"],
      middleNotes: ["Rosemary", "Mint"],
      baseNotes: ["Cedar", "Vetiver"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  },
  {
    id: 4,
    name: "Ocean Breeze",
    brand: "Scent Trail",
    description: "A fresh aquatic fragrance that captures the essence of a coastal retreat. This invigorating scent opens with sea salt and cucumber, develops into a heart of lavender and marine notes, and settles into a clean base of white musk and ambergris.",
    price: 8800,
    image: "/perfume4.jpg",
    category: "fresh",
    featured: true,
    inStock: true,
    rating: 4.6,
    reviews: 103,
    fragrance: {
      topNotes: ["Sea Salt", "Cucumber"],
      middleNotes: ["Lavender", "Marine Notes"],
      baseNotes: ["White Musk", "Ambergris"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  },
  {
    id: 5,
    name: "Spiced Teakwood",
    brand: "Scent Trail",
    description: "A sophisticated woody fragrance with warm spice accents. The composition begins with cinnamon and nutmeg, transitions to a heart of rich teakwood and cedarwood, and lingers with comforting notes of tonka bean and vanilla.",
    price: 10000,
    image: "/perfume5.jpg",
    category: "woody",
    featured: false,
    inStock: false,
    rating: 4.9,
    reviews: 87,
    fragrance: {
      topNotes: ["Cinnamon", "Nutmeg"],
      middleNotes: ["Teakwood", "Cedarwood"],
      baseNotes: ["Tonka Bean", "Vanilla"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  },
  {
    id: 6,
    name: "Golden Nectar",
    brand: "Scent Trail",
    description: "A luxurious gourmand fragrance that entices with its sweet sophistication. Opening with honey and almond, it evolves to reveal praline and caramel heart notes, finally settling into a rich base of vanilla and chocolate.",
    price: 11200,
    image: "/perfume6.jpg",
    category: "gourmand",
    featured: false,
    inStock: true,
    rating: 4.7,
    reviews: 92,
    fragrance: {
      topNotes: ["Honey", "Almond"],
      middleNotes: ["Praline", "Caramel"],
      baseNotes: ["Vanilla", "Chocolate"]
    },
    size: {
      value: 50,
      unit: "ml"
    }
  }
];

export const featuredProducts = products.filter(product => product.featured);
export const getProductById = (id: number) => products.find(product => product.id === id);
export const getRelatedProducts = (id: number, category: string) => 
  products
    .filter(product => product.id !== id && product.category === category)
    .slice(0, 3);
