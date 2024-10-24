import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sessionId, amount } = await req.json();  // Get sessionId and amount from the request body
    console.log(sessionId, amount);  // Log the values to make sure they're received correctly
    const MID= process.env.MERCHANT_ID;
    const Pass = process.env.MERCHANT_PASS;
    console.log(MID);
    console.log(Pass);
    const response = await fetch(
      `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/session/${sessionId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "order": {
            amount: amount,  // Use the dynamic amount passed from the frontend
            currency: `${process.env.CURRENCY}`
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error updating session');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("error occoured while processing api", error);
    return NextResponse.json({ error: 'Session update failed' }, { status: 500 });
  }
}
