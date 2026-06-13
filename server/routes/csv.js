const express = require('express')
const router = express.Router()
const { upload, uploadCSV, confirmCSV } = require('../controllers/csvController')

router.post('/', upload.array('files'), uploadCSV)
router.post('/confirm', confirmCSV)

module.exports = router