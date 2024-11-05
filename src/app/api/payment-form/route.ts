import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId") || "DEFAULT_SESSION_ID";
  const amount = url.searchParams.get("amount") || "0";  
  const MID = process.env.MERCHANT_ID;
  // const Pass = process.env.MERCHANT_PASS;

  // console.log(`Session ID: ${sessionId}`);
  // console.log(`Amount: ${amount}`);
  // console.log(MID);
  // console.log(Pass);


  const orderId = generateUniqueId();
  function generateUniqueId() {
    return Math.floor(Math.random() * 1000000).toString();
  }

  return new NextResponse(
    `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Payment Gateway</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <script src="${process.env.URL}.gateway.mastercard.com/form/version/74/merchant/${MID}/session.js"></script>
          <style id="antiClickjack">
            body {
              display: none !important;
            }
          </style>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Arial', sans-serif;
              background-color: #e9ecef;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: #333;
            }

            .payment-card {
              background-color: #ffffff;
              border-radius: 15px;
              padding: 40px;
              max-width: 400px;
              width: 100%;
              box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
              text-align: center;
              transition: transform 0.2s;
            }

            .payment-card:hover {
              transform: scale(1.02);
            }

            h3 {
              margin-bottom: 15px;
              color: #FF8F00;
              font-size: 24px;
            }

            .logo {
              width: 90px;
              margin-bottom: 20px;
            }

            input {
              width: 100%;
              padding: 14px;
              margin: 12px 0;
              border-radius: 8px;
              border: 1px solid #ccc;
              font-size: 16px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              transition: border-color 0.3s, box-shadow 0.3s;
            }

            input:focus {
              border-color: #FF6F00;
              outline: none;
              box-shadow: 0 0 5px rgba(255, 111, 0, 0.5);
            }

            button {
              background-color: #FF8F00;
              color: white;
              padding: 16px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 18px;
              width: 100%;
              margin-top: 15px;
              transition: background-color 0.3s ease, transform 0.2s;
            }

            button:hover {
              background-color: #e65c00;
              transform: translateY(-2px);
            }

            .loader {
              display: none; /* Hidden by default */
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1000;
            }

            .loader div {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #FF8F00;
              animation: loader 1.2s infinite;
              margin: 0 5px;
            }

            @keyframes loader {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.5);
              }
              100% {
                transform: scale(1);
              }
            }

            .title {
              font-size: 20px;
              margin-bottom: 25px;
              color: #FF6F00;
            }

            .card-icons {
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
            }

            .card-icons i {
              font-size: 40px;
              margin: 0 5px;
              transition: transform 0.3s;
            }

            .card-icons i:hover {
              transform: scale(1.1);
            }

            .fab.fa-cc-visa {
              color: #1A1F71;
            }

            .fab.fa-cc-mastercard {
              background: linear-gradient(90deg, #EA3E30, #FBB03B);
              -webkit-background-clip: text; 
              -webkit-text-fill-color: transparent;
            }

            .fab.fa-cc-amex {
              color: #0072B8;
            }

            .fab.fa-cc-discover {
              color: #FF9B00;
            }

            .fab.fa-cc-maestro {
              color: #A500B5;
            }

            .fab.fa-cc-jcb {
              color: #5B1B7B;
            }

            .fab.fa-cc-diners-club {
              color: #A81C47;
            }

             .toast {
              position: fixed;
              top: 20px;
              right: 20px;
              background-color: #f44336; /* Red color for errors */
              color: white;
              padding: 15px 20px;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              opacity: 0;
              transition: opacity 0.5s ease, transform 0.3s ease;
              font-family: 'Arial', sans-serif; /* Added font for better readability */
              font-size: 16px; /* Increased font size */
              z-index: 1000; /* Ensure it appears above other elements */
              display: flex;
              align-items: center;
            }

            .toast.show {
              opacity: 1;
              transform: translateY(0);
            }

            .toast.hide {
              opacity: 0;
              transform: translateY(-20px); /* Smooth exit effect */
            }

            .toast-icon {
              margin-right: 10px; /* Space between icon and text */
              font-size: 20px; /* Icon size */
            }

          </style>
        </head>
        <body>
          <div class="loader" id="loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="payment-card">
            <img src="/artema-logo.png" alt="Logo" class="logo" /> 
            <h3>Enter Your Credit Card Details</h3>
            <div class="card-icons">
              <i class="fab fa-cc-mastercard" aria-hidden="true"></i>
              <i class="fab fa-cc-visa" aria-hidden="true"></i>
              <i class="fab fa-cc-amex" aria-hidden="true"></i>
              <i class="fab fa-cc-discover" aria-hidden="true"></i>
              <i class="fab fa-cc-maestro" aria-hidden="true"></i>
              <i class="fab fa-cc-jcb" aria-hidden="true"></i>
              <i class="fab fa-cc-diners-club" aria-hidden="true"></i>
            </div>
            <div>
              <input type="text" id="card-number" placeholder="Card Number" readonly />
            </div>
            <div>
              <input type="text" id="expiry-month" placeholder="Expiry Month" readonly />
            </div>
            <div>
              <input type="text" id="expiry-year" placeholder="Expiry Year" readonly />
            </div>
            <div>
              <input type="text" id="security-code" placeholder="Security Code" readonly />
            </div>
            <div>
              <input type="text" id="cardholder-name" placeholder="Cardholder Name" readonly />
            </div>
            <div>
              <button id="payButton" onclick="pay()">Verify Card Credential</button>
            </div>
          </div>

           <!-- Toast Notification -->
          <div class="toast" id="toast">
            <span class="toast-icon"><i class="fas fa-exclamation-triangle"></i></span>
            <span id="toast-message">Error: Authentication Failed</span>
          </div>


          <script type="text/javascript">
          // Existing code
            if (self === top) {
              var antiClickjack = document.getElementById("antiClickjack");
              antiClickjack.parentNode.removeChild(antiClickjack);
            } else {
              top.location = self.location;
            }

            function showToast(message) {
            const toast = document.getElementById("toast");
            const toastMessage = document.getElementById("toast-message");
            toastMessage.textContent = message;
            
            toast.classList.remove("hide"); // Remove hide class if present
            toast.classList.add("show");

            setTimeout(() => {
              toast.classList.remove("show");
              toast.classList.add("hide");
            }, 3000); // Toast visible for 3 seconds
          }


            PaymentSession.configure({
              session: "${sessionId}",
              fields: {
                card: {
                  number: "#card-number",
                  securityCode: "#security-code",
                  expiryMonth: "#expiry-month",
                  expiryYear: "#expiry-year",
                  nameOnCard: "#cardholder-name",
                },
              },
              frameEmbeddingMitigation: ["javascript"],
              callbacks: {
                initialized: function (response) {},
                formSessionUpdate: function (response) {
                  // Hide loader when processing is done
                  document.getElementById("loader").style.display = "none";

                  if (response.status && response.status === "ok") {
                    // console.log("Session updated with updated card data: " + response.session.id);

                    fetch('/api/initiate-auth', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ sessionId: response.session.id, orderId: "${orderId}" })
                    })
                    .then((res) => res.json())
                    .then((data) => {
                      // console.log("Initiate Auth API Response:", data);
                      
                      if (data && !data.error) {
                        // console.log('Authentication initiated successfully!');
                        window.location.href = '/initiate-auth?orderId=${orderId}&amount=${amount}&sessionId=' + response.session.id ;
                      } else {
                        showToast('Authentication Failed: ' + (data.error || 'Unknown error'));
                      }
                    })
                    .catch((error) => {
                      // console.error("API Call Error:", error);
                      showToast('API Call Error: ' + error.message);
                    });
                  } else {
                    // console.error("Session update failed:", response);
                    if(response.status == 'fields_in_error'){
                        showToast('Inalid Card Details');
                    }else if(response.errors.message) {
                        showToast(response.errors.message);
                    }else{
                        showToast('Error Processing the Request.');
                    }
                  }
                },
              },
              interaction: {
                displayControl: {
                  formatCard: "EMBOSSED",
                  invalidFieldCharacters: "REJECT",
                },
              },
            });

            function pay() {
              // Show loader when the payment process starts
              document.getElementById("loader").style.display = "flex"; // Show loader
              PaymentSession.updateSessionFromForm("card");
            }

          </script>
        </body>
      </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
