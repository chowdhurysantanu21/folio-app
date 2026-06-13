const mongoose = require('mongoose')

const holdingSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    qty: {
        type: Number,
        required: true
    },
    avgPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Holding = mongoose.model('Holding', holdingSchema)

module.exports = Holding