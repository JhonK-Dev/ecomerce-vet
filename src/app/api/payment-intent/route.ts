import { NextRequest, NextResponse } from "next/server";
import { stripe } from '@/lib/stripe';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        const { amount, metadata } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Monto inválido' },
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'pen',
            metadata: {
                userId,
                orderId: metadata?.orderId || 'temp',
                petId: metadata?.petId || 'temp',
                appointmentId: metadata?.appointmentId || 'temp',
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id  
         });
         
    } catch (error) {
        console.error('Error creando Payment Intent:', error);
        return NextResponse.json(
            { error: 'Error creando Payment Intent' },
            { status: 500 }
        );
    }
}