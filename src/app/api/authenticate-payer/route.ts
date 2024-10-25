// app/authenticate-payer/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("i am in the authenticate payer api");
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    // Get the request body
    const { sessionId, orderId, amount } = await request.json();
    // const storedAmount = Number(localStorage.getItem('paymentAmount'));
    const MID= process.env.MERCHANT_ID;
    const Pass = process.env.MERCHANT_PASS;

      console.log(sessionId);
      console.log(orderId);
      console.log(MID);
      console.log(Pass);
      console.log("amount!!!!!!!!!!!!", amount);
      
    // Define the API URL
    const apiUrl = `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/order/${orderId}/transaction/${orderId}`;

    // Create the request body dynamically
    const requestBody = {
      apiOperation: 'AUTHENTICATE_PAYER',
      correlationId: `START_AUTH${Date.now()}`, // Generate a unique correlation ID
      device: {
        browserDetails: {
          screenWidth: 1920,
          javaEnabled: false,
          screenHeight: 1080,
          "3DSecureChallengeWindowSize": "FULL_SCREEN",
          timeZone: -120,
          language: "EN",
          colorDepth: 24,
        },
        browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
        ipAddress: "182.185.178.141", // You might want to dynamically get this
      },
      authentication: {
        redirectResponseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/pay?sessionId=${sessionId}&orderId=${orderId}&amount=${amount}`,
      },
      order: {
        amount: amount, // This amount should come from your session or business logic
        currency: `${process.env.CURRENCY}`,
      },
      session: {
        id: sessionId, // Use the session ID passed in the request
      },
    };

    // Make the API request to Mastercard
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Handle the response
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const data = await response.json();
    
    console.log("response is ok  api called ");
    console.log("******************************************");
    console.log(data);
    console.log("******************************************");
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.log("error occoured while processing api", error);
    return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
  }
}
