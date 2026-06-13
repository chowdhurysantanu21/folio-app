const Holding = require ('../models/Holding')
const yahooFinance = require('../config/yahooFinance')

//Get all holdings
const getHoldings = async (req, res) => {
    try {
        const holdings = await Holding.find()
        res.json({ success: true, data: holdings})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

// Add a new holding
const addHolding = async (req, res) => {
    try {
        const { symbol, name, qty, avgPrice } = req.body

        // Check if holding already exists
        const existing = await Holding.findOne({ symbol: symbol.toUpperCase() })
        if (existing) {
            return res.status(400).json({
                success:false,
                message: `${symbol.toUpperCase()} already exists in your portfolio`
            })
        }
        const holding = await Holding.create({ symbol, name, qty, avgPrice })
        res.status(201).json({ success: true, data: holding})
    } catch (error) {
        res.status(500).json({ status: false, message: error.message})
    }
}

// Get a single holding
const getHoldingById = async (req, res) => {
    try {
        const holding = await Holding.findById(req.params.id)
        if (!holding) {
            return res.status(404).json({ success: false, message: 'Holding not found'})
        }
        res.json({ success: true, data: holding })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Update a holding
const updateHolding = async (req, res) => {
    try {
        const holding = await Holding.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        )
        if (!holding) {
            return res.status(404).json({ success: false, message: 'Holding not found'})
        }
        res.json({ success: true, data: holding })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}


// Delete a holding
const deleteHolding = async (req, res) => {
    try {
        const holding = await Holding.findByIdAndDelete(req.params.id)
        if (!holding) {
            return res.status(404).json({ success: false, message: 'Holding not found'})
        }
        res.json({ success: true, message: 'Holding removed' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

const getPortfolio = async (req, res) => {
    try {
        // Step 1 - fetch all holdings from MongoDB
        const holdings = await Holding.find()

        if (holdings.length === 0) {
            return res.json({ success: true, summary: {}, data: []})
        }

        // Step 2 - fetch live prices for all holdings simultaneously
        const prices = await Promise.all(
            holdings.map(async (holding) => {
                const result = await yahooFinance.quote(`${holding.symbol}.NS`)
                return {
                    symbol: holding.symbol,
                    ltp: result.regularMarketPrice,
                    change: result.regularMarketChange,
                    changePercent: result.regularMarketChangePercent
                }
            })
        )

        // Step 3 - combine holdings with prices and calculate P&L
        const portfolioData = holdings.map((holding) => {
            const priceData = prices.find(p => p.symbol === holding.symbol)
            const ltp = priceData ? priceData.ltp : holding.avgPrice
            const totalInvested = holding.avgPrice * holding.qty
            const currentValue = ltp * holding.qty
            const gain = currentValue - totalInvested
            const gainPercent = (gain /totalInvested) * 100

            return {
                _id: holding._id,
                symbol: holding.symbol,
                name: holding.name,
                qty: holding.qty,
                avgPrice: holding.avgPrice,
                ltp: ltp,
                change: priceData ? priceData.change : 0,
                changePercent: priceData ? priceData.changePercent : 0,
                totalInvested: +totalInvested.toFixed(2),
                currentValue: +currentValue.toFixed(2),
                gain: +gain.toFixed(2),
                gainPercent: +gainPercent.toFixed(2)
            }
        })

        // Step 4 - calculate overall portfolio summary
        const summary = {
            totalInvested: +portfolioData.reduce((sum, h) => sum + h.totalInvested, 0).toFixed(2),
            currentValue: +portfolioData.reduce((sum, h) => sum + h.currentValue, 0).toFixed(2),
            totalGain: +portfolioData.reduce((sum, h) => sum + h.gain, 0).toFixed(2),
            totalGainPercent: 0
        }

        summary.totalGainPercent = +(
            (summary.totalGain / summary.totalInvested) * 100
        ).toFixed(2)

        res.json({ success: true, summary, data: portfolioData})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}

module.exports = {getHoldings, addHolding, getHoldingById, updateHolding, deleteHolding, getPortfolio}