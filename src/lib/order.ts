import { Order, OrderStatus } from "@/types";
import { EmailService } from "./email";

const orders: Order[] = [];

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">): Promise<Order> {

  const newOrder: Order = {
    ...orderData,
    id: (orders.length + 1).toString(),
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  orders.push(newOrder);
  
  // Enviar notificación de creación de pedido
  await EmailService.sendOrderConfirmation(newOrder);
  
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date();

    // Enviar notificación de actualización de estado
    await EmailService.sendOrderStatusUpdate(order);

    return order;
}