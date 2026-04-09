import React, { useState } from 'react';

export default function PaymentForm() {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/employer/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (res.ok) alert("Payment successful!");
    else alert("Payment failed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <button type="submit">Pay</button>
    </form>
  );
}