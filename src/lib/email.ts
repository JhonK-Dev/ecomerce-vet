// Servicio de emails con Resend
import { Resend } from 'resend';
import { Appointment } from '@/types/veterinary';
import { Order, User } from '@/types/index';

// Inicializar Resend con validación
const apiKey = process.env.RESEND_API_KEY;

// Fallback para desarrollo si no se carga desde .env.local
const fallbackApiKey = apiKey || 're_Rddqvp2P_LktexLiVkiUQsq7QmUGMKMZ3';

if (!fallbackApiKey || fallbackApiKey === 're_your_resend_api_key_here') {
  throw new Error('RESEND_API_KEY is not properly configured. Please check your .env.local file.');
}
const resend = new Resend(fallbackApiKey);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@ecommercevet.com';
  
  // Enviar email genérico
  static async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      const { error } = await resend.emails.send({
        from: template.from || this.FROM_EMAIL,
        to: template.to,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error('Error enviando email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en servicio de email:', error);
      return false;
    }
  }

  // Confirmación de cita
  static async sendAppointmentConfirmation(appointment: Appointment, userEmail: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: userEmail,
      subject: `Confirmación de Cita - ${appointment.reason}`,
      html: this.getAppointmentConfirmationTemplate(appointment)
    };

    return this.sendEmail(template);
  }

  // Recordatorio de cita
  static async sendAppointmentReminder(appointment: Appointment, userEmail: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: userEmail,
      subject: `Recordatorio: Cita mañana - ${appointment.reason}`,
      html: this.getAppointmentReminderTemplate(appointment)
    };

    return this.sendEmail(template);
  }

  // Cancelación de cita
  static async sendAppointmentCancellation(appointment: Appointment, userEmail: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: userEmail,
      subject: `Cita Cancelada - ${appointment.reason}`,
      html: this.getAppointmentCancellationTemplate(appointment)
    };

    return this.sendEmail(template);
  }

  // Confirmación de pedido
  static async sendOrderConfirmation(order: Order): Promise<boolean> {
    const template: EmailTemplate = {
      to: order.user.email,
      subject: `Confirmación de Pedido #${order.id}`,
      html: this.getOrderConfirmationTemplate(order)
    };

    return this.sendEmail(template);
  }

  // Actualización de estado de pedido
  static async sendOrderStatusUpdate(order: Order): Promise<boolean> {
    const template: EmailTemplate = {
      to: order.user.email,
      subject: `Actualización de Pedido #${order.id} - ${order.status}`,
      html: this.getOrderStatusTemplate(order)
    };

    return this.sendEmail(template);
  }

  // Email de bienvenida
  static async sendWelcomeEmail(user: User): Promise<boolean> {
    const template: EmailTemplate = {
      to: user.email,
      subject: '¡Bienvenido a EcommerceVet!',
      html: this.getWelcomeTemplate(user)
    };

    return this.sendEmail(template);
  }

  // Templates HTML
  private static getAppointmentConfirmationTemplate(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmación de Cita</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Cita Confirmada</h1>
            </div>
            <div class="content">
              <p>¡Hola! Tu cita ha sido confirmada exitosamente.</p>
              
              <div class="appointment-details">
                <h3>Detalles de la Cita</h3>
                <div class="detail-row">
                  <strong>Motivo:</strong>
                  <span>${appointment.reason}</span>
                </div>
                <div class="detail-row">
                  <strong>Fecha:</strong>
                  <span>${appointmentDate}</span>
                </div>
                <div class="detail-row">
                  <strong>Hora:</strong>
                  <span>${appointment.startTime} - ${appointment.endTime}</span>
                </div>
                <div class="detail-row">
                  <strong>ID Veterinario:</strong>
                  <span>${appointment.veterinarianId}</span>
                </div>
                <div class="detail-row">
                  <strong>Estado:</strong>
                  <span>${appointment.status}</span>
                </div>
                <div class="detail-row">
                  <strong>Costo Total:</strong>
                  <span>$${appointment.totalCost?.toLocaleString() || 'Por determinar'}</span>
                </div>
              </div>

              ${appointment.notes ? `
                <div class="appointment-details">
                  <h3>Notas Adicionales</h3>
                  <p>${appointment.notes}</p>
                </div>
              ` : ''}

              ${appointment.symptoms ? `
                <div class="appointment-details">
                  <h3>Síntomas Reportados</h3>
                  <p>${appointment.symptoms}</p>
                </div>
              ` : ''}

              <p><strong>Importante:</strong></p>
              <ul>
                <li>Llega 10 minutos antes de tu cita</li>
                <li>Trae la cartilla de vacunación de tu mascota</li>
                <li>Si necesitas cancelar, hazlo con al menos 24 horas de anticipación</li>
              </ul>

              <a href="#" class="button">Ver Detalles de la Cita</a>
            </div>
            <div class="footer">
              <p>EcommerceVet - Cuidando a tu mascota</p>
              <p>Si tienes preguntas, contáctanos al (555) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getAppointmentReminderTemplate(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Recordatorio de Cita</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Recordatorio de Cita</h1>
            </div>
            <div class="content">
              <p>¡Hola! Te recordamos que tienes una cita mañana.</p>
              
              <div class="appointment-details">
                <h3>Detalles de tu Cita</h3>
                <div class="detail-row">
                  <strong>Motivo:</strong>
                  <span>${appointment.reason}</span>
                </div>
                <div class="detail-row">
                  <strong>Fecha:</strong>
                  <span>${appointmentDate}</span>
                </div>
                <div class="detail-row">
                  <strong>Hora:</strong>
                  <span>${appointment.startTime} - ${appointment.endTime}</span>
                </div>
                <div class="detail-row">
                  <strong>ID Veterinario:</strong>
                  <span>${appointment.veterinarianId}</span>
                </div>
                <div class="detail-row">
                  <strong>Estado:</strong>
                  <span>${appointment.status}</span>
                </div>
              </div>

              <p><strong>Recordatorios importantes:</strong></p>
              <ul>
                <li>🕘 Llega 10 minutos antes</li>
                <li>📋 Trae la cartilla de vacunación</li>
                <li>💊 Si tu mascota toma medicamentos, trae la lista</li>
                <li>📞 Si no puedes asistir, llámanos: (555) 123-4567</li>
              </ul>

              <a href="#" class="button">Confirmar Asistencia</a>
            </div>
            <div class="footer">
              <p>EcommerceVet - Cuidando a tu mascota</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getAppointmentCancellationTemplate(appointment: Appointment): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Cita Cancelada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Cita Cancelada</h1>
            </div>
            <div class="content">
              <p>Tu cita ha sido cancelada exitosamente.</p>
              
              <div class="appointment-details">
                <h3>Detalles de la Cita Cancelada</h3>
                <p><strong>Motivo:</strong> ${appointment.reason}</p>
                <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
                <p><strong>ID Veterinario:</strong> ${appointment.veterinarianId}</p>
                <p><strong>Estado:</strong> ${appointment.status}</p>
              </div>

              <p>Si necesitas reagendar, puedes hacerlo en cualquier momento.</p>

              <a href="#" class="button">Agendar Nueva Cita</a>
            </div>
            <div class="footer">
              <p>EcommerceVet - Cuidando a tu mascota</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getOrderConfirmationTemplate(order: Order): string {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmación de Pedido</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f3f4f6; padding: 12px; text-align: left; }
            .total-row { font-weight: bold; background: #f9f9f9; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 Pedido Confirmado</h1>
              <p>Pedido #${order.id}</p>
            </div>
            <div class="content">
              <p>¡Gracias por tu compra! Tu pedido ha sido confirmado y está siendo procesado.</p>
              
              <div class="order-details">
                <h3>Productos Ordenados</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style="text-align: center;">Cantidad</th>
                      <th style="text-align: right;">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                      <td style="padding: 15px; text-align: right;">$${order.total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="order-details">
                <h3>Información de Entrega</h3>
                <p><strong>Dirección:</strong><br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                ${order.shippingAddress.zipCode}</p>
                <p><strong>Tipo de entrega:</strong> ${order.deliveryType === 'home_delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}</p>
              </div>

              <p>Te notificaremos cuando tu pedido esté en camino.</p>
            </div>
            <div class="footer">
              <p>EcommerceVet - Todo para tu mascota</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getOrderStatusTemplate(order: Order): string {
    const statusMessages = {
      pending: 'Tu pedido está pendiente de confirmación',
      confirmed: 'Tu pedido ha sido confirmado',
      processing: 'Tu pedido está siendo preparado',
      shipped: 'Tu pedido ha sido enviado',
      delivered: 'Tu pedido ha sido entregado',
      cancelled: 'Tu pedido ha sido cancelado'
    };

    const statusColors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Actualización de Pedido</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusColors[order.status]}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Actualización de Pedido</h1>
              <p>Pedido #${order.id}</p>
            </div>
            <div class="content">
              <div class="status-update">
                <h2>${statusMessages[order.status]}</h2>
                ${order.trackingNumber ? `<p><strong>Número de seguimiento:</strong> ${order.trackingNumber}</p>` : ''}
              </div>

              <p>Puedes seguir el estado de tu pedido en cualquier momento desde tu cuenta.</p>
            </div>
            <div class="footer">
              <p>EcommerceVet - Todo para tu mascota</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static getWelcomeTemplate(user: User): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bienvenido a EcommerceVet</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .feature { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 ¡Bienvenido a EcommerceVet!</h1>
              <p>Hola ${user.name}, gracias por unirte a nuestra comunidad</p>
            </div>
            <div class="content">
              <p>Estamos emocionados de tenerte con nosotros. En EcommerceVet encontrarás todo lo que necesitas para cuidar a tu mascota.</p>
              
              <div class="feature">
                <h3>🛒 Productos de Calidad</h3>
                <p>Alimentos, medicinas, accesorios y más para tu mascota</p>
              </div>

              <div class="feature">
                <h3>🏥 Servicios Veterinarios</h3>
                <p>Agenda citas con nuestros veterinarios especializados</p>
              </div>

              <div class="feature">
                <h3>🚚 Entrega a Domicilio</h3>
                <p>Recibe tus productos directamente en tu hogar</p>
              </div>

              <a href="#" class="button">Explorar Productos</a>
              <a href="#" class="button">Agendar Cita</a>
            </div>
            <div class="footer">
              <p>EcommerceVet - Cuidando a tu mascota desde 2024</p>
              <p>Si tienes preguntas, contáctanos al (555) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}