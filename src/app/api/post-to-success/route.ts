// app/api/post-to-success/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("I am in the post-to-success api");
    // Parse the incoming request body

    // const { sessionId, orderId } = await request.;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") || "DEFAULT_SESSION_ID";
    const orderId = url.searchParams.get("orderId") || "DEFAULT_orderId";
    console.log(sessionId);
    console.log(orderId);
    // Construct the URL to call the success-auth page using GET method
    const successAuthUrl = `http://localhost:3000/success-auth?sessionId=${sessionId}&orderId=${orderId}`;
      console.log(successAuthUrl);
    // Make a GET request to success-auth page
    const response = await fetch(successAuthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch success page' }, { status: 500 });
    }

    // Extract the response from the success-auth page if needed
    const pageContent = await response.text(); // Assuming it's rendering a page

    return NextResponse.json({ message: 'Success', content: pageContent }, { status: 200 });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
