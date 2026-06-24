import { formatMoney, formatPercent } from "../utils/format"

function SummaryCards({ summary }) {
  return (
    <div className="flex gap-6 mb-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Total Invested</p>
        <p className="text-xl font-semibold">{formatMoney(summary.totalInvested)}</p>
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
  )
}

export default SummaryCards
