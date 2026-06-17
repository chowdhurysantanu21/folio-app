import { useState, useEffect } from "react"

function App() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
              <td className={`py-2 px-3 ${holding.gainPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercent(holding.gainPercent)}
              </td>
              <td className={`py-2 px-3 ${holding.dayChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatMoney(holding.dayChange)}
              </td>
              <td className={`py-2 px-3 ${holding.dayChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercent(holding.dayChangePercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
