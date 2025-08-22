import { Order, OrderStatus } from "@/types";
import { EmailService } from "./email";

const STORAGE_KEY = 'ecommercevet-orders'; 

function saveOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

function loadOrders(): Order[] {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
}

const orders: Order[] = loadOrders();

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">): Promise<Order> {

  const newOrder: Order = {
    ...orderData,
    id: (orders.length + 1).toString(),
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  orders.push(newOrder);
    saveOrders(orders);
  
  // Enviar notificación de creación de pedido
  await EmailService.sendOrderConfirmation(newOrder);
  
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date();
    saveOrders(orders);

    // Enviar notificación de actualización de estado
    await EmailService.sendOrderStatusUpdate(order);

    return order;
}