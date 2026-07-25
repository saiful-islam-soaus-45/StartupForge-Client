import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');
    const PRICE_ID = "price_1TwPP9LI7BPA9Cngbtpi6C8j";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/pricing/success-subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    // সরাসরি স্ট্রাইপের ইউআরএলে রিডাইরেক্ট করে দেবো
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe Error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}