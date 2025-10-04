// Estructura base
import Stripe from 'stripe';

const secretkey = process.env.STRIPE_SECRET_KEY;

if (!secretkey) {
  throw new Error('Falta la clave secreta de Stripe en las variables de entorno');
}

export const stripe = new Stripe(secretkey, {
  apiVersion: '2025-09-30.clover',
});