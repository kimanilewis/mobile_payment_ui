import React, { useState } from 'react';
import './App.css';
import config from './config';
import { Buffer } from 'buffer'

//const API_BASE_URL = config.API_BASE_URL;
const API_BASE_URL = "http://localhost:9001"

const App: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation functions (as mentioned earlier)
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value); 
  };
  
  const isValidAmount = (amount: string): boolean => {
    const amountValue = parseFloat(amount);
    return !isNaN(amountValue) && amountValue > 0;
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidAmount(value)) {
      setAmount(value);
    } else {
      // Show error message or handle invalid input
    }
  };
  const handlePayment = async () => {
    if (!isValidAmount(amount)) {
      // Handle invalid input, show error message, etc.
      return;
    }
    const generateBase64Password = (shortcode: string, passkey: string, timestamp: string): string => {
      const combinedString = `${shortcode}${passkey}${timestamp}`;
      const encodedString = Buffer.from(combinedString).toString('base64');
      return encodedString;
    };
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Construct the payload
    const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const date = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}${month}${date}${hour}${minute}${second}`;

  const password = generateBase64Password("174379", "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919", timestamp);
    const payload = {
      BusinessShortCode: 174379,
      Password : password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 5,
      PartyA: mobileNumber,
      PartyB: 174379,
      PhoneNumber: mobileNumber,
      CallBackURL: "https://mydomain.com/path",
      AccountReference: "SAFARI",
      TransactionDesc: "Payment for charge",
    };

    console.log(payload);
    try {
      const response = await fetch(`${API_BASE_URL}`, 
      {
        method: 'POST',
        body: JSON.stringify(payload),
      });
 
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle success response from the API if needed
        setSuccessMessage(data.message);
      } else {
        // Handle error response from the API
        setErrorMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.log(error);
      // Handle network error
      setErrorMessage('Please complete MPESA payment(KES ' + amount + ') sent on your phone. ' +  mobileNumber);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Safari Power</h1>
      <div>
        <label>Mobile Number:</label>
        <input type="text" value={mobileNumber} onChange={handleMobileNumberChange} />
      </div>
      <div>
        <label>Amount to Pay:</label>
        <input type="text" value={amount} onChange={handleAmountChange} />
      </div>
      <button onClick={handlePayment}>Pay</button>

      {loading && <div className="message">Processing payment...</div>}
      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}
    </div>
  );
};

export default App;
