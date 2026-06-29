import { useState } from "react"
import { formatMoney, formatPercent } from "../utils/format"

function HoldingsTable({ holdings, handleDelete }) {
  const [sortKey, setSortKey] = useState("symbol")
  const [sortDir, setSortDir] = useState("asc")

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const comparison = typeof aVal === "string" ? aVal.localeCompare(bVal) : aVal - bVal
    return sortDir === "asc" ? comparison : -comparison
  })

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700 text-left text-gray-400">
          {[
            { label: "Symbol", key: "symbol" },
            { label: "Name", key: "name" },
            { label: "Qty", key: "qty" },
            { label: "Avg Price", key: "avgPrice" },
            { label: "LTP", key: "ltp" },
            { label: "Invested", key: "totalInvested" },
            { label: "Cur. Value", key: "currentValue" },
            { label: "P&L", key: "gain" },
            { label: "P&L %", key: "gainPercent" },
            { label: "Day Change", key: "dayChange" },
            { label: "Day Chg %", key: "dayChangePercent" },
          ].map(({ label, key }) => (
            <th
              key={key}
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => handleSort(key)}
            >
              {label}
              {sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
            </th>
          ))}
          <th className="py-2 px-3"></th>
        </tr>
      </thead>
      <tbody>
        {sortedHoldings.map((holding) => (
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
  )
}

export default HoldingsTable
