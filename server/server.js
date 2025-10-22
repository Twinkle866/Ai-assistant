import express from 'express'
import 'dotenv/config'   
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'
import path from 'path'
import { fileURLToPath } from 'url'
import {dirname} from 'path'

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const app = express()

// Connect DB
await connectDB()

// Stripe webhooks (Must be before express.json() if you need the raw body)
app.post('/api/strive', express.raw({type:'application/json'}), stripeWebhooks)

// Middleware
app.use(cors())
app.use(express.json())

// --- 1. API ROUTES (Define all your API routes here) ---
app.use('/api/user' , userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

// --- 2. SERVE FRONTEND STATIC ASSETS ---
// This serves JS/CSS/Images from the Client/dist build folder.
app.use(express.static(path.join(__dirname, '..', 'Client', 'dist')));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'Client', 'dist', 'index.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'Client', 'dist', 'index.html'));
});