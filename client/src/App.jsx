import { useState, useEffect } from "react"

function App() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [symbol, setSymbol] = useState("")
  const [qty, setQty] = useState("")
  const [avgPrice, setAvgPrice] = useState("")

  const fetchPortfolio = () => {
    fetch("http://localhost:8000/api/holdings/portfolio")
      .then((response) => response.json())
      .then((result) => {
        // console.log("FETCH RESULT:", result)
        setHoldings(result.data)
        setSummary(result.summary)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/holdings/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          fetchPortfolio()
        }
      })
      .catch((err) => console.error("Delete failed: ", err))
  }

  const handleAdd = () => {
    fetch("http://localhost:8000/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol.toUpperCase(),
        qty: Number(qty),
        avgPrice: Number(avgPrice),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setSymbol("")
          setQty("")
          setAvgPrice("")
          fetchPortfolio()
        } else {
          alert(result.message)
        }
      })
      .catch((err) => console.error("Add failed: ", err))
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  // formatting helpers

  const formatMoney = (num) =>
    num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatPercent = (num) => num.toFixed(2)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2x1 font-bold mb-4">My Portfolio</h1>

      {summary && (
        <div className="flex gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Invested</p>
            <p className="text-X1 font-semibold">{formatMoney(summary.totalInvested)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-xl font-semibold">{formatMoney(summary.currentValue)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total P&amp;L</p>
            <p
              className={`text-xl font-semibold ${summary.totalGain >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {formatMoney(summary.totalGain)} ({formatPercent(summary.totalGainPercent)}%)
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Day's P&amp;L</p>
            <p
              className={`text-xl font-semibold ${summary.dayGain >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {formatMoney(summary.dayGain)} ({formatPercent(summary.dayGainPercent)}%)
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6 items-end">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Symbol</label>
          <input 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-800 rounded px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Qty</label>
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="bg-gray-800 rounded px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Avg Price</label>
          <input
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            className="bg-gray-800 rounded px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white">
            Add Stock
          </button>
        </div>
      </div>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-left text-gray-400">
            <th className="py-2 px-3">Symbol</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Qty</th>
            <th className="py-2 px-3">Avg Price</th>
            <th className="py-2 px-3">LTP</th>
            <th className="py-2 px-3">Invested</th>
            <th className="py-2 px-3">Cur. Value</th>
            <th className="py-2 px-3">P&amp;L</th>
            <th className="py-2 px-3">P&amp;L %</th>
            <th className="py-2 px-3">Day Change</th>
            <th className="py-2 px-3">Day Chg %</th>
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.symbol} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="py-2 px-3">{holding.symbol}</td>
              <td className="py-2 px-3">{holding.name}</td>
              <td className="py-2 px-3">{holding.qty}</td>
              <td className="py-2 px-3">{formatMoney(holding.avgPrice)}</td>
              <td className="py-2 px-3">{formatMoney(holding.ltp)}</td>
              <td className="py-2 px-3">{formatMoney(holding.totalInvested)}</td>
              <td className="py-2 px-3">{formatMoney(holding.currentValue)}</td>
              <td className={`py-2 px-3 ${holding.gain >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatMoney(holding.gain)}
              </td>
              <td
                className={`py-2 px-3 ${holding.gainPercent >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {formatPercent(holding.gainPercent)}
              </td>
              <td
                className={`py-2 px-3 ${holding.dayChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {formatMoney(holding.dayChange)}
              </td>
              <td
                className={`py-2 px-3 ${holding.dayChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {formatPercent(holding.dayChangePercent)}
              </td>
              <td className="py-2 px-3">
                <button
                  onClick={() => handleDelete(holding._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App


// the form, placed before the <table>:
{/* <div className="flex gap-3 mb-6 items-end">
  <div>
    <label className="block text-gray-400 text-sm mb-1">Symbol</label>
    <input
      value={symbol}
      onChange={(e) => setSymbol(e.target.value)}
      className="bg-gray-800 rounded px-3 py-2 text-gray-100"
    />
  </div>
  <div>
    <label className="block text-gray-400 text-sm mb-1">Qty</label>
    <input
      value={qty}
      onChange={(e) => setQty(e.target.value)}
      className="bg-gray-800 rounded px-3 py-2 text-gray-100 w-24"
    />
  </div>
  <div>
    <label className="block text-gray-400 text-sm mb-1">Avg Price</label>
    <input
      value={avgPrice}
      onChange={(e) => setAvgPrice(e.target.value)}
      className="bg-gray-800 rounded px-3 py-2 text-gray-100 w-28"
    />
  </div>
  <button
    onClick={handleAdd}
    className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white"
  >
    Add Stock
  </button>
</div> */}