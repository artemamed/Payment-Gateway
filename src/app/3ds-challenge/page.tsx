'use client';

import React, { useEffect, useState } from 'react';

const ThreeDSChallenge: React.FC = () => {
  interface ResponseData {
    authentication?: {
      redirect?: {
        html?: string;
      };
    };
    response?: {
      gatewayRecommendation?: string;
    };
    error?: string;
  }

  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  useEffect(() => {
    // Retrieve the data from localStorage
    const data = localStorage.getItem('authData');
    if (data) {
      setResponseData(JSON.parse(data));
    } else {
      setResponseData({ error: 'No data received' });
    }
  }, []);

  // Function to trigger form submission manually
  const executeFormScript = () => {
    const form = document.getElementById('threedsChallengeRedirectForm') as HTMLFormElement;
    if (form) {
      form.submit();  // Manually trigger form submission
    }
  };

  useEffect(() => {
    if (responseData?.authentication?.redirect?.html && responseData?.response?.gatewayRecommendation === "PROCEED") {
      executeFormScript(); // Execute the form submission script after rendering
    }
  }, [responseData]);

  const renderHtmlContent = () => {
    if (responseData?.response?.gatewayRecommendation === "PROCEED") {
      // If gateway recommendation is PROCEED, render the HTML
      if (responseData.authentication?.redirect?.html) {
        const rawHtml = responseData.authentication.redirect.html;
        return (
          <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
        );
      } else {
        return <p>No HTML content found.</p>;
      }
    } else {
      // If gateway recommendation is not PROCEED, show unauthorized message
      return (
        <div>
          <p>Unauthorized request.</p>
          <p>Gateway Recommendation: {responseData?.response?.gatewayRecommendation || "No recommendation"}</p>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* <h1>3DS Challenge</h1> */}
      {renderHtmlContent()} {/* Conditionally show HTML or Unauthorized message */}
    </div>
  );
};

export default ThreeDSChallenge;
