const yahooFinance = require('../config/yahooFinance')

const getPrice = async (req, res) => {
    try {
        const { symbol } = req.params
        const query = `${symbol.toUpperCase()}.NS`
        const result = await yahooFinance.quote(query)
        console.log("Result: ", result)
        res.json({
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                ltp: result.regularMarketPrice,
                dayChange: result.regularMarketChange,
                dayChangePercent: result.regularMarketChangePercent,
                high52Week: result.fiftyTwoWeekHigh,
                low52Week: result.fiftyTwoWeekLow,
                pe: result.trailingPE,
                eps: result.epsTrailingTwelveMonths,
                marketCap: result.marketCap
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

const getPrices = async (req, res) => {
    try {
        const { symbols} = req.query
        const symbolList = symbols.split(',')

        const prices = await Promise.all(
            symbolList.map(async(symbol) => {
                const result = await yahooFinance.quote(`${symbol}.NS`)
                return {
                    symbol: symbol.toUpperCase(),
                    ltp: result.regularMarketPrice,
                    dayChange: result.regularMarketChange,
                    dayChangePercent: result.regularMarketChangePercent
                }
            })
        )
        res.json({ success: true, data: prices })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { getPrice, getPrices }