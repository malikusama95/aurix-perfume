
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  fragrance: {
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
  };
  size: {
    value: number;
    unit: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
