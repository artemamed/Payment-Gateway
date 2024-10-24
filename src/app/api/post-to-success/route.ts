// app/api/post-to-success/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    
    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") || "DEFAULT_SESSION_ID";
    const orderId = url.searchParams.get("orderId") || "DEFAULT_orderId";
    
    console.log(sessionId);
    console.log(orderId);

    // Construct the redirect URL
    const successAuthUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success-auth?sessionId=${sessionId}&orderId=${orderId}`;
    console.log(successAuthUrl);
    
    // Redirect the user to the success-auth page
    return NextResponse.redirect(successAuthUrl);

  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
