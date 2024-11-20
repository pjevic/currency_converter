/** @format */

import { useEffect, useState } from "react";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
// `https://api.frankfurter.app/latest?base=${fromCurrency}&symbol=${toCurrency}`

export default function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(
    function () {
      if (amount === 0 || amount === "") return;
      if (fromCurrency === toCurrency) {
        setConvertedAmount(amount);
        return;
      }

      async function convert() {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        const data = await res.json();

        const converted = data.rates[toCurrency].toFixed(2);

        setConvertedAmount(converted);
        console.log(converted);
      }
      convert();
    },
    [amount, fromCurrency, toCurrency]
  );

  console.log(convertedAmount);

  return (
    <div className="app">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="RSD">RSD</option>
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="RSD">RSD</option>
      </select>
      <p>OUTPUT: {convertedAmount} </p>
    </div>
  );
}
