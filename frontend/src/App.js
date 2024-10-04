import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [usDollar, setUsDollar] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
        if (json.length > 0) {
          setSelectedCoin(json[0]);
        }
      });
  }, []);

  const onSelect = (e) => {
    const selectedCoinId = e.target.value;
    const coin = coins.find((coin) => coin.id === selectedCoinId);
    setSelectedCoin(coin);
  };

  const onChange = (e) => {
    setUsDollar(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedCoin && usDollar) {
      const coinAmount = parseFloat(usDollar) / selectedCoin.quotes.USD.price;
      setResult(
        `You can buy ${coinAmount.toFixed(6)} ${
          selectedCoin.symbol
        }with $${usDollar} `
      );
    }
  };

  return (
    <div>
      <h1>The List of the coins {loading ? "" : `(${coins.length})`}</h1>
      {loading ? (
        <strong> Loading... </strong>
      ) : (
        <select onChange={onSelect} value={selectedCoin?.id}>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol}): {coin.quotes.USD.price} USD
            </option>
          ))}
        </select>
      )}

      <h2>How much coins you can buy?</h2>

      <form onSubmit={onSubmit}>
        <input
          type="number"
          value={usDollar}
          onChange={onChange}
          placeholder="Enter USD"
        />

        <button type="submit">Convert</button>
      </form>

      {result && <h3>{result}</h3>}
    </div>
  );
}

export default App;
