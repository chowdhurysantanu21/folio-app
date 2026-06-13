// 1. Imports
const multer = require('multer')
const { parse } = require('csv-parse')
const Holding = require('../models/Holding')
const yahooFinance = require('../config/yahooFinance')

// 2. Multer config
const storage = multer.memoryStorage()
const upload = multer({ storage })

// 3. parseCSV function
const parseCSV = (buffer) => {
    return new Promise((resolve, reject) => {
        parse(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        }, (err, records) => {
            if (err) reject(err)
            else resolve(records)
        })
    })
}

// 4. normalizeHoldings function
const normalizeHoldings = (records) => {
    const valid = records
        .filter(row => row['Symbol'] && row['Qty'] && row['AvgPrice'])
        .map(row => ({
            symbol: row['Symbol'].trim().toUpperCase(),
            qty: parseFloat(row['Qty']),
            avgPrice: parseFloat(row['AvgPrice'])
        }))
        .filter(row => row.qty > 0 && row.avgPrice > 0)

    // Group by symbol and calculate weighted average
    const grouped = {}
    valid.forEach(row => {
        if (grouped[row.symbol]) {
            const existing = grouped[row.symbol]
            const totalQty = existing.qty + row.qty
            const weightedAvg = (
                (existing.qty * existing.avgPrice) + (row.qty * row.avgPrice)
            ) / totalQty
            grouped[row.symbol] = {
                symbol: row.symbol,
                name: row.symbol,
                qty: totalQty,
                avgPrice: +weightedAvg.toFixed(2)
            }
        } else {
            grouped[row.symbol] = {
                symbol: row.symbol,
                name: row.symbol,
                qty: row.qty,
                avgPrice: row.avgPrice
            }
        }
    })
    return Object.values(grouped)
}

// 5. uploadCSV function
const uploadCSV = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' })
        }

        // Step 1 - parse all uploaded CSVs
        let allRecords = []
        for (const file of req.files) {
            const records = await parseCSV(file.buffer)
            allRecords = [...allRecords, ...records]
        }

        // Step 2 - normalize and merge duplicates
        const incomingHoldings = normalizeHoldings(allRecords)

        if (incomingHoldings.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid holdings found. Check your CSV format — columns must be Symbol, Qty, AvgPrice'
            })
        }

        // Step 3 - fetch company names from Yahoo Finance
        const holdingsWithNames = await Promise.all(
            incomingHoldings.map(async (holding) => {
                try {
                    const result = await yahooFinance.quote(`${holding.symbol}.NS`)
                    return {
                        ...holding,
                        name: result.longName || result.shortName || holding.symbol
                    }
                } catch {
                    return { ...holding, name: holding.symbol }
                }
            })
        )

        // Step 4 - get existing holdings from MongoDB
        const existingHoldings = await Holding.find()

        // Step 5 - calculate diff
        const toAdd = holdingsWithNames.filter(h =>
            !existingHoldings.find(e => e.symbol === h.symbol)
        )
        const toUpdate = holdingsWithNames.filter(h => {
            const existing = existingHoldings.find(e => e.symbol === h.symbol)
            if (!existing) return false
            return existing.qty !== h.qty || existing.avgPrice !== h.avgPrice
        })
        const toRemove = existingHoldings.filter(e =>
            !holdingsWithNames.find(h => h.symbol === e.symbol)
        )

        res.json({
            success: true,
            preview: {
                toAdd,
                toUpdate,
                toRemove
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const confirmCSV = async (req, res) => {
    try {
        const { toAdd, toUpdate, toRemove, keepRemoved } = req.body

        // Add new holdings
        if (toAdd && toAdd.length > 0) {
            await Holding.insertMany(toAdd)
        }

        // Update existing holdings
        if (toUpdate && toUpdate.length > 0) {
            await Promise.all(
                toUpdate.map(h =>
                    Holding.findOneAndUpdate(
                        { symbol: h.symbol },
                        { qty: h.qty, avgPrice: h.avgPrice, name: h.name },
                        { new: true }
                    )
                )
            )
        }

        // Remove holdings not in CSV (only if user chose to remove)
        if (!keepRemoved && toRemove && toRemove.length > 0) {
            await Promise.all(
                toRemove.map(h =>
                    Holding.findOneAndDelete({ symbol: h.symbol })
                )
            )
        }

        const added = toAdd?.length || 0
        const updated = toUpdate?.length || 0
        const removed = !keepRemoved ? toRemove?.length || 0 : 0

        const nothingChanged = added === 0 && updated === 0 && removed === 0

        res.json({
            success: true,
            message: nothingChanged
                ? 'Portfolio is already up to date — no changes made'
                : `Portfolio updated — ${added} added, ${updated} updated, ${removed} removed`
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Some holdings already exist — try uploading again to get an updated preview'
            })
        }
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { upload, uploadCSV, confirmCSV }