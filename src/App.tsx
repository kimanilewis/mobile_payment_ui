import React, { useState } from 'react';
import './App.css';
import config from './config';

const API_BASE_URL = config.API_BASE_URL;

const App: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handlePayment = async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

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
        setSuccessMessage('Payment successful!');
      } else {
        setErrorMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Safari Payment App</h1>
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
