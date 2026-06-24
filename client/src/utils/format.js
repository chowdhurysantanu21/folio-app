// formatting helpers

export const formatMoney = (num) =>
  num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatPercent = (num) => num.toFixed(2)
