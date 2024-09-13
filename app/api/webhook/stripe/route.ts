import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

console.log("HIT STRIPE ENDPOINT WEBHOOK");

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Initialize Firebase Admin
initializeFirebaseAdmin();
const firestore = getFirestore();

export async function POST(request: Request) {
  console.log('Webhook received');

  try {
    // Get the raw body as text
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.log('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!stripeWebhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not set');
      }

      // Construct the event
      event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
      console.log('Event constructed successfully:', event.type);
    } catch (err: any) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout.session.completed:', session.id);
        const subscriptionId = session.subscription as string;

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

            const metadata = session.metadata;
            if (metadata && metadata.userDocRef && metadata.menuDocRef) {
              const userDocRef = firestore.doc(metadata.userDocRef);
              const menuDocRef = firestore.doc(metadata.menuDocRef);

              await userDocRef.update({
                paymentStatus: 'completed',
                stripeSessionId: session.id,
                subscriptionEndDate: currentPeriodEnd,
              });

              await menuDocRef.update({
                paymentStatus: 'completed',
                stripeSessionId: session.id,
                subscriptionEndDate: currentPeriodEnd,
              });

              console.log(`Payment succeeded. Updated documents: userDocRef=${metadata.userDocRef}, menuDocRef=${metadata.menuDocRef}`);
            } else {
              console.log('Missing metadata in session');
            }
          } catch (err) {
            console.error(`Error processing subscription: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        } else {
          console.log('No subscription ID found in session');
        }
        break;
      // Add more cases for other event types you want to handle
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in Stripe webhook handler:', error);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}