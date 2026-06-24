function AddStockForm({ symbol, qty, avgPrice, setSymbol, setQty, setAvgPrice, handleAdd }) {
  return (
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
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white"
        >
          Add Stock
        </button>
      </div>
    </div>
  )
}

export default AddStockForm