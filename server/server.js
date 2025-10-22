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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Connect DB
await connectDB()

//Stripe webooks
app.post('/api/strive',express.raw({type:'application/json'},stripeWebhooks))

// Middleware
app.use(cors())
app.use(express.json())

// Routes

app.use('/api/user' , userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)
app.use(express.static(path.join(__dirname, '..', 'Client', 'dist')));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
app.get('/:path([\\s\\S]*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'Client', 'dist', 'index.html'));
});