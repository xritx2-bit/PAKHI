export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'sarees' | 'kurtas';
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  fabric: string;
  occasion: 'Wedding' | 'Festive' | 'Casual' | 'Party' | 'Office';
  pattern: string;
  isNew: boolean;
  isTrending: boolean;
  stock: number;
  colors: ProductColor[];
  sizes?: string[]; // XS, S, M, L, XL, XXL
  blouseIncluded?: boolean;
  blouseLength?: string;
  sareeLength?: string;
  careInstructions: string;
  details: string[];
}

export interface CartItem {
  id: string; // unique cart entry id
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
  blouseIncluded?: boolean;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: ShippingAddress;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'PAID' | 'PENDING';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  createdAt: string;
  estimatedDelivery: string;
}
