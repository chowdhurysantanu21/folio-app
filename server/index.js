const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const holdingsRouter = require('./routes/holdings')
const csvRouter = require('./routes/csv')
const connectDB = require('./config/db')

dotenv.config()

connectDB()
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/holdings', holdingsRouter)
app.use('/api/csv', csvRouter)

app.get('/', (req, res) => {
    res.send('Folio app is running')
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})