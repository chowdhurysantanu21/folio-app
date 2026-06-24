import { useState, useEffect } from "react"
import { formatMoney, formatPercent } from "./utils/format"
import SummaryCards from "./components/SummaryCards"
import AddStockForm from "./components/AddStockForm"
import HoldingsTable from "./components/HoldingsTable"

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

      {summary && <SummaryCards summary={summary} />}
      
      <AddStockForm
        symbol={symbol}
        qty={qty}
        avgPrice={avgPrice}
        setSymbol={setSymbol}
        setQty={setQty}
        setAvgPrice={setAvgPrice}
        handleAdd={handleAdd}
      />

      <HoldingsTable holdings={holdings} handleDelete={handleDelete} />

    </div>
  )
}

export default App
