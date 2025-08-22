import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { UserRole } from '@/types';

export async function POST(req: Request) {
  // Get the headers
  const headersList = req.headers;
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return new Response('Error: Missing webhook secret', {
      status: 500
    });
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  
  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name } = evt.data;
        
        // En lugar de usar clerkClient, deberás implementar tu propia 
        // lógica para asignar roles en la base de datos
        console.log(`User created: ${id}, ${email_addresses[0]?.email_address}, ${first_name} ${last_name}`);
        console.log(`Default role assigned: ${UserRole.CLIENT}`);
        break;
      }
      
      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = evt.data;
        console.log(`User updated: ${id}, ${email_addresses[0]?.email_address}, ${first_name} ${last_name}`);
        break;
      }
      
      case 'user.deleted': {
        const { id } = evt.data;
        console.log(`User deleted: ${id}`);
        break;
      }
      
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
    
    return NextResponse.json(
      { message: `Webhook processed: ${eventType}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
