import { formatMoney, formatPercent } from "../utils/format"

function HoldingsTable({ holdings, handleDelete }) {
  return (
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
  )
}

export default HoldingsTable
