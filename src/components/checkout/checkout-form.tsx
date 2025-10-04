import { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
    amount: number; // amount in cents
    onSuccess: () => void;
}

export function CheckoutForm({ amount, onSuccess}: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

        if (error) {
            setErrorMessage(error.message || 'Ocurrio un error');
        } else if (paymentIntent?.status === 'succeeded') {
            onSuccess();
        }
    }catch (error: any) {
            setErrorMessage(error.message);
        }finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 rounded">
                    {errorMessage}
                </div>
            )}  
            
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                    </>
                    ) : (
                        `Pagar $${(amount / 100).toFixed(2)}`
                    )}
            </Button>
        </form>
    );
}