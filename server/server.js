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
const __dirname = dirname(__filename);

const app = express()

await connectDB()

app.post('/api/strive', express.raw({type:'application/json'}), stripeWebhooks)

app.use(cors())
app.use(express.json())

app.use('/api/user' , userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

// FIX: Use path.resolve(process.cwd()) for safer static path during server start
app.use(express.static(path.resolve(process.cwd(), 'Client', 'dist')));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// FIX: Two-line fallback for reliable client-side routing
app.get('/', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'Client', 'dist', 'index.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'Client', 'dist', 'index.html'));
});