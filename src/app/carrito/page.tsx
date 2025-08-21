'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Truck,
  CreditCard,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react'
import {
  Cart,
  CartItem,
  UserRole,
  PaymentMethod,
  PaymentStatus,
  DeliveryType,
} from '@/types/index'
import { CartService } from '@/lib/cart'
import { cn } from '@/lib/utils'
import { createOrder } from '@/lib/order'
import { Alert } from '@/components/ui/alert'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    const loadCart = () => {
      const currentCart = CartService.getCart()
      setCart(currentCart)
      setLoading(false)
    }

    loadCart()
  }, [])

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = CartService.updateQuantity(itemId, quantity)
    setCart(updatedCart)
  }

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = CartService.removeFromCart(itemId)
    setCart(updatedCart)
  }

  const handleClearCart = () => {
    const clearedCart = CartService.clearCart()
    setCart(clearedCart)
  }

  const handleApplyCoupon = () => {
    // Simulación de aplicar cupón
    if (couponCode.toLowerCase() === 'descuento10') {
      setAppliedCoupon('DESCUENTO10')
      setCouponCode('')
    } else {
      alert('Cupón inválido')
    }
  }

  const handleCheckout = async () => {
    setOrderSuccess(false)
    setOrderError('')
    try {
      const orderData = {
        userId: '1',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Alvaro Mahipo',
          role: UserRole.CLIENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: cart?.items ?? [],
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        tax: summary.tax,
        discount: couponDiscount,
        total: finalTotal,
        status: 'pending',
        paymentMethod: PaymentMethod.PAYPAL,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: {
          street: 'Calle Falsa 123',
          city: 'Springfield',
          state: 'IL',
          zipCode: '12345',
          country: 'USA',
        },
        deliveryType: DeliveryType.HOME_DELIVERY,
      }
      await createOrder(orderData)
      setOrderSuccess(true)
      handleClearCart()
    } catch {
      setOrderError('Error al crear la orden')
    }
  }

  const summary = cart
    ? CartService.getCartSummary()
    : {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      }

  // Aplicar descuento del cupón
  const couponDiscount = appliedCoupon ? summary.subtotal * 0.1 : 0
  const finalTotal = summary.total - couponDiscount

  function renderOrderNotifications() {
    return (
      <>
        {orderSuccess && (
          <Alert>
            ¡Orden creada con éxito y recibirás una confirmación por correo
            electrónico!
          </Alert>
        )}
        {orderError && <Alert variant="destructive">{orderError}</Alert>}
      </>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
          <p className="text-muted-foreground mb-6">
            Agrega algunos productos para comenzar tu compra
          </p>
          <Button asChild>
            <Link href="/productos">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Explorar productos
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {renderOrderNotifications()}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Carrito de Compras
          </h1>
          <p className="text-muted-foreground">
            {summary.itemCount}{' '}
            {summary.itemCount === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/productos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir comprando
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Productos ({cart.items.length})</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar carrito
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </CardContent>
          </Card>

          {/* Coupon Section */}
          <Card>
            <CardHeader>
              <CardTitle>Cupón de Descuento</CardTitle>
            </CardHeader>
            <CardContent>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {appliedCoupon}
                    </Badge>
                    <span className="text-sm text-green-700">
                      10% de descuento aplicado
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-green-700 hover:text-green-800"
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Aplicar
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Prueba con: DESCUENTO10 para obtener 10% de descuento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>S/. {summary.subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedCoupon}):</span>
                    <span>-S/. {couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span
                    className={summary.shipping === 0 ? 'text-green-600' : ''}
                  >
                    {summary.shipping === 0
                      ? 'Gratis'
                      : `S/. ${summary.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IGV (18%):</span>
                  <span>S/. {summary.tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">
                    S/. {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {summary.subtotal < 150 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm">
                      Agrega S/. {(150 - summary.subtotal).toFixed(2)} más para
                      envío gratis
                    </span>
                  </div>
                </div>
              )}

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                <CreditCard className="mr-2 h-5 w-5" />
                Finalizar compra
              </Button>

              <div className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/productos">Seguir Comprando</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Compra Segura</p>
                  <p>Tus datos están protegidos con encriptación SSL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente para cada item del carrito
function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (delta: number) => {
    setIsUpdating(true)
    const newQuantity = item.quantity + delta
    onUpdateQuantity(item.id, newQuantity)

    // Simular delay para UX
    setTimeout(() => setIsUpdating(false), 200)
  }

  const isOutOfStock = item.product.stock === 0
  const exceedsStock = item.quantity > item.product.stock

  return (
    <div
      className={cn(
        'flex gap-4 p-4 border rounded-lg transition-colors',
        (isOutOfStock || exceedsStock) &&
          'border-destructive/50 bg-destructive/5'
      )}
    >
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.images[0] || '/placeholder-product.jpg'}
          alt={item.product.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href={`/productos/${item.product.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {item.product.brand}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {(isOutOfStock || exceedsStock) && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>
              {isOutOfStock
                ? 'Producto agotado'
                : `Solo ${item.product.stock} disponibles`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= item.product.stock || isUpdating}
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-bold">
              S/. {(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              S/. {item.price.toFixed(2)} c/u
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
