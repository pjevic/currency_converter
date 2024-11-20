/** @format */

import { useEffect, useState } from "react";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
// `https://api.frankfurter.app/latest?base=${fromCurrency}&symbol=${toCurrency}`

export default function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [isLoading, setIsLoading] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(null);

  function handleInputValue(e) {
    if (e.target.value === 0 || e.target.value === "") setAmount("");
    setAmount(e.target.value);
  }

  useEffect(() => {
    if (amount <= 0) {
      setConvertedAmount("");
      return;
    }
    if (amount === "" || fromCurrency === toCurrency) {
      setConvertedAmount(fromCurrency === toCurrency ? amount : 0);
      return;
    }

    const controller = new AbortController();

    async function convert() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch conversion data.");

        const data = await res.json();
        const converted = data.rates[toCurrency]?.toFixed(2) || 0;

        setConvertedAmount(converted);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    convert();

    return () => {
      controller.abort();
    };
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="app">
      <input type="number" value={amount} onChange={(e) => handleInputValue(e)} />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>OUTPUT: {isLoading ? "Converting..." : convertedAmount} </p>
    </div>
  );
}
