import React, { useState } from 'react';
import './App.css';
import Config from './Config';

const API_BASE_URL = Config.API_BASE_URL; // Replace with your API base URL

const App: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          amount,
        }),
      });

      if (response.ok) {
        // Payment successful logic
        console.log('Payment successful!');
      } else {
        // Handle payment failure
        console.error('Payment failed');
      }
    } catch (error) {
      // Handle network error
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Mobile Payment App</h1>
      <div>
        <label>Mobile Number:</label>
        <input type="text" value={mobileNumber} onChange={handleMobileNumberChange} />
      </div>
      <div>
        <label>Amount to Pay:</label>
        <input type="text" value={amount} onChange={handleAmountChange} />
      </div>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default App;

