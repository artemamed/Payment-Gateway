

export async function POST(req: Request) {
    console.log("I am in the payment API function.");

    try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get("sessionId") || "DEFAULT_SESSION_ID";
        const orderId = url.searchParams.get("orderId") || "DEFAULT_orderId";
        const amount = url.searchParams.get("amount") || 0;

        const MID = process.env.MERCHANT_ID;
        const Pass = process.env.MERCHANT_PASS;
        const apiUrl = `${process.env.URL}.gateway.mastercard.com/api/rest/version/74/merchant/${MID}/order/${orderId}/transaction/${orderId + 1}`;

        const body = {
            apiOperation: "PAY",
            authentication: {
                transactionId: orderId,
            },
            order: {
                amount: amount,
                currency: `${process.env.CURRENCY}`,
            },
            session: {
                id: sessionId,
            }
        };

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`merchant.${MID}:${Pass}`).toString('base64'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from Mastercard:", errorData);
            return new Response(
                `<html>
                    <body style="text-align: center;">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                        <h1 style="font-size: 2em; color: red;">Error processing payment</h1>
                    </body>
                </html>`,
                { status: response.status, headers: { 'Content-Type': 'text/html' } }
            );
        }

        
        const data = await response.json();
        const gatewayCode = data.response.gatewayCode;
        const cardholderName = data.sourceOfFunds.provided.card.nameOnCard;
        console.log(cardholderName);
        const amountreceived = data.transaction.amount;

        if (gatewayCode === "APPROVED") {
            // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@approved");

            return new Response(
                `<html>
                    <body style="text-align: center;">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.25 15.5L5.5 12l1.41-1.41L10.75 14.6l7.29-7.29L19.5 9.5l-8.75 8.75z"/>
                        </svg>
                        <h1 style="font-size: 2em; color: green;">Transaction Successful</h1>
                        <div style="margin-top: 20px; font-size: 1.2em; text-align: center;">
                            <p><strong>Amount:</strong> USD ${amountreceived}</p>
                            <p><strong>Cardholder Name:</strong>${cardholderName}</p>
                        </div>
                    </body>
                </html>`,
                { headers: { 'Content-Type': 'text/html' } }
            );
        } else {
            const failureReason = data.response.gatewayMessage || "Transaction failed";
            return new Response(
                `<html>
                    <body style="text-align: center;">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                        <h1 style="font-size: 2em; color: red;">${failureReason}</h1>
                    </body>
                </html>`,
                { status: 400, headers: { 'Content-Type': 'text/html' } }
            );
        }

    } catch (error) {
        console.error("Error occurred during payment processing:", error);
        return new Response(
            `<html>
                <body style="text-align: center;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <h1 style="font-size: 2em; color: red;">Payment processing failed</h1>
                </body>
            </html>`,
            { status: 500, headers: { 'Content-Type': 'text/html' } }
        );
    }
}
