const express = require('express')
const router = express.Router()
const { getHoldings, addHolding, getHoldingById, updateHolding, deleteHolding, getPortfolio } = require('../controllers/holdingController')

router.get('/', getHoldings)
router.post('/', addHolding)
router.get('/portfolio', getPortfolio)
router.get('/:id', getHoldingById)
router.put('/:id', updateHolding)
router.delete('/:id', deleteHolding)

module.exports = router