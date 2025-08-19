// Tipos principales del sistema Ecommerce Vet

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  VETERINARIAN = 'veterinarian',
  CLIENT = 'client'
}

// Tipos para E-commerce
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  brand: string;
  images: string[];
  stock: number;
  isActive: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  FOOD = 'food',
  MEDICINE = 'medicine',
  ACCESSORIES = 'accessories',
  HYGIENE = 'hygiene',
  TOYS = 'toys',
  SUPPLEMENTS = 'supplements'
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  deliveryType: DeliveryType;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  MERCADOPAGO = 'mercadopago',
  CASH = 'cash'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum DeliveryType {
  HOME_DELIVERY = 'home_delivery',
  STORE_PICKUP = 'store_pickup'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  reference?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  expiresAt: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

// Tipos para filtros y búsqueda
export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}