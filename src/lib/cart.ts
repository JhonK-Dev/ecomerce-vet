// Gestión del carrito de compras
import { Cart, CartItem, Product } from '@/types';

export class CartService {
  private static STORAGE_KEY = 'ecommercevet_cart';

  // Obtener carrito actual
  static getCart(): Cart {
    if (typeof window === 'undefined') {
      return {
        id: 'temp',
        userId: '',
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      if (cartData) {
        const cart = JSON.parse(cartData);
        return {
          ...cart,
          createdAt: new Date(cart.createdAt),
          updatedAt: new Date(cart.updatedAt)
        };
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }

    return {
      id: 'temp',
      userId: '',
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Guardar carrito
  private static saveCart(cart: Cart): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }

  // Calcular total del carrito
  private static calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Agregar producto al carrito
  static addToCart(product: Product, quantity: number = 1): Cart {
    const cart = this.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      // Si el producto ya existe, actualizar cantidad
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      cart.items[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
    } else {
      // Si es un producto nuevo, agregarlo
      const cartItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        product,
        quantity: Math.min(quantity, product.stock),
        price: product.discountPrice || product.price
      };
      cart.items.push(cartItem);
    }

    cart.total = this.calculateTotal(cart.items);
    cart.updatedAt = new Date();
    this.saveCart(cart);
    
    return cart;
  }

  // Actualizar cantidad de un item
  static updateQuantity(itemId: string, quantity: number): Cart {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        cart.items.splice(itemIndex, 1);
      } else {
        // Actualizar cantidad respetando el stock disponible
        const maxQuantity = cart.items[itemIndex].product.stock;
        cart.items[itemIndex].quantity = Math.min(quantity, maxQuantity);
      }

      cart.total = this.calculateTotal(cart.items);
      cart.updatedAt = new Date();
      this.saveCart(cart);
    }

    return cart;
  }

  // Remover item del carrito
  static removeFromCart(itemId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.total = this.calculateTotal(cart.items);
    cart.updatedAt = new Date();
    this.saveCart(cart);
    
    return cart;
  }

  // Limpiar carrito
  static clearCart(): Cart {
    const cart: Cart = {
      id: 'temp',
      userId: '',
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.saveCart(cart);
    return cart;
  }

  // Obtener cantidad total de items
  static getItemCount(): number {
    const cart = this.getCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Verificar si un producto está en el carrito
  static isInCart(productId: string): boolean {
    const cart = this.getCart();
    return cart.items.some(item => item.productId === productId);
  }

  // Obtener cantidad de un producto específico en el carrito
  static getProductQuantity(productId: string): number {
    const cart = this.getCart();
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  // Calcular subtotal, impuestos y total
  static getCartSummary(): {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  } {
    const cart = this.getCart();
    const subtotal = cart.total;
    const itemCount = this.getItemCount();
    
    // Calcular envío (gratis si es mayor a 150)
    const shipping = subtotal >= 150 ? 0 : 15;
    
    // Calcular impuesto (18% IGV en Perú)
    const tax = subtotal * 0.18;
    
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount
    };
  }

  // Validar disponibilidad de stock antes del checkout
  static validateStock(): { isValid: boolean; errors: string[] } {
    const cart = this.getCart();
    const errors: string[] = [];

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        errors.push(`${item.product.name}: Solo quedan ${item.product.stock} unidades disponibles`);
      }
      if (item.product.stock === 0) {
        errors.push(`${item.product.name}: Producto agotado`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}