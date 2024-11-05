import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const MID= process.env.MERCHANT_ID;
     const Pass = process.env.MERCHANT_PASS;
    //  console.log(MID);
    //  console.log(Pass);

    const response = await fetch(
      `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/session`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    // console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
  }
}
