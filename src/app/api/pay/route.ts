import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    console.log("I am in the payment API function.");

    try {
        const { sessionId, orderId, amount } = await req.json();  // Get sessionId and orderId from the frontend
        console.log("Session ID:", sessionId);
        console.log("Order ID:", orderId);
         console.log("Amount:", amount)
 

        const MID= process.env.MERCHANT_ID;
        // const storedAmount = Number(localStorage.getItem('paymentAmount'));
        const Pass = process.env.MERCHANT_PASS;
        console.log(MID);
        // console.log(storedAmount);
        // Construct the API URL using the orderId
        const apiUrl = `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/order/${orderId}/transaction/${orderId+1}`;
        
        // Define the request body according to the Mastercard API documentation
        const body = {
            apiOperation: "PAY",
            authentication: {
                transactionId: orderId,  // Use orderId as the transactionId
            },
            order: {
                amount: amount,  // Specify the amount here
                currency: `${process.env.CURRENCY}`,  // Specify the currency
            },
            session: {
                id: sessionId,  // Use the sessionId from the request
            }
        };

        // Make the API call to Mastercard's Pay endpoint
        const response = await fetch(apiUrl, {
            method: 'PUT',  // Use PUT method for the Mastercard API
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(body),  // Send the request body as JSON
        });

        // Check if the response is not OK
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from Mastercard:", errorData);
            return NextResponse.json({ error: errorData.message || 'Error processing payment' }, { status: response.status });
        }

        const data = await response.json();  // Parse the response JSON
        console.log("Payment response data:", data);
        return NextResponse.json(data);  // Return the API response back to the frontend

    } catch (error) {
        console.error("Error occurred during payment processing:", error);
        return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
    }
}
