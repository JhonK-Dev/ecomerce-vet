import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';
import { Appointment } from '@/types/veterinary';

export async function POST(request: NextRequest) {
  try {
    const { appointment, userEmail, type } = await request.json();

    if (!appointment || !userEmail || !type) {
      return NextResponse.json(
        { success: false, message: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    console.log('🔔 API: Enviando email de tipo:', type);
    console.log('📧 API: Email destino:', userEmail);
    console.log('🏥 API: Cita ID:', appointment.id);

    let success = false;

    switch (type) {
      case 'confirmation':
        success = await EmailService.sendAppointmentConfirmation(appointment, userEmail);
        break;
      case 'reminder':
        success = await EmailService.sendAppointmentReminder(appointment, userEmail);
        break;
      case 'cancellation':
        success = await EmailService.sendAppointmentCancellation(appointment, userEmail);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Tipo de email no válido' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Email de ${type} enviado exitosamente a ${userEmail}`,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: `Error al enviar email de ${type}` 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Error en API send-appointment-email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Error interno: ${(error as Error).message}` 
      },
      { status: 500 }
    );
  }
}