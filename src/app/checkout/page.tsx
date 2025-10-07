'use client';

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CartService } from "@/lib/cart"
import { useRouter } from "next/navigation";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) throw new Error("Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
const stripePromise = loadStripe(publishableKey);


export default function CheckoutPage() {
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const cart = CartService.getCart();

        if (cart.items.length === 0) {
            router.push('/carrito');
            return;
        }

        const totalInCents = Math.round(cart.total * 100);
        setAmount(totalInCents);

        const createPaymentIntent = async () => {
            try {
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: totalInCents,
                        metadata: {
                            cartId: cart.id,
                        }
                    }),
                });

                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
            }
        };

        createPaymentIntent();
    }, [router]);

    if (!clientSecret) {
        return <div className="p-8">Cargando checkout...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <Elements stripe={stripePromise} options={{
                clientSecret, appearance: { theme: 'stripe' }
            }}
            >
                <CheckoutForm amount={amount} onSuccess={() => {
                    router.push('/order-success');
                }}
                />
            </Elements>
        </div>
    );
}