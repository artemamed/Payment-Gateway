import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    console.log("I am in initiate authentication api  function ");
   
  try {
    const { sessionId , orderId} = await req.json();  // Get sessionId from the frontend
    // const orderId = generateUniqueId();
    // const transactionId = generateUniqueId(); // Create a unique transaction ID

     console.log("i amm min the auth api try function @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
      console.log(sessionId);
      console.log(orderId);
      const MID= process.env.MERCHANT_ID;
     const Pass = process.env.MERCHANT_PASS;
     console.log(MID);
     console.log(Pass);
    const apiUrl = `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/order/${orderId}/transaction/${orderId}`;
    
    const body = {
        
            "session":{
            "id": sessionId
            },
            "apiOperation":"INITIATE_AUTHENTICATION",
            "correlationId":"INIT_AUTH11187-991090777766",
            "transaction":
            {
            "reference":orderId
            },
            "order":{
            "reference":orderId,
            "currency":`${process.env.CURRENCY}`
            },
            "authentication":{
                "purpose":"PAYMENT_TRANSACTION",
                "channel":"PAYER_BROWSER",
            "acceptVersions":"3DS2"
            }
            };

    // Make the API call to Mastercard's Initiate Authentication endpoint
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),  // Send the request body as JSON
    });

    if (!response.ok) {
      throw new Error('Error initiating authentication');
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);  // Return API response back to the frontend
  } catch (error) {
    console.error('Error initiating authentication:', error);
    return NextResponse.json({ error: 'Authentication initiation failed' }, { status: 500 });
  }
}

// // Helper function to generate a unique ID for the order and transaction
// function generateUniqueId() {
//   return Math.floor(Math.random() * 1000000).toString(); // Simple unique ID generator
// }
