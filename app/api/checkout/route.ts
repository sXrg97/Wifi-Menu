import { getUserDocumentRefsByClerkUserId } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  console.log('API route hit');
  
  try {
    const user = await currentUser();

    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user document references
    const userDocData = await getUserDocumentRefsByClerkUserId(user.id);

    // Check if the userDocData is null (i.e., the user was not found in the database)
    if (!userDocData) {
      console.log(`User with Clerk user ID ${user.id} not found in the database.`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { userDocRef, menuDocRef } = userDocData;

    // Convert Firestore document references to strings
    const userDocPath = userDocRef.path;
    const menuDocPath = menuDocRef.path;

    // Parse incoming request data
    const { priceId } = await req.json(); // priceId is the Stripe price ID

    console.log('Request data:', { priceId });
    console.log('Authenticated user:', user);

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: user.id,
        userDocRef: userDocPath,
        menuDocRef: menuDocPath
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`, // Redirect on successful payment
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`, // Redirect on payment cancellation
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
