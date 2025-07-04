import express from 'express';
import 'dotenv/config';
import {sql} from './config/db.js';
import { limiter } from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import { initDB } from './config/db.js';
import job from './config/cron.js';

if(process.env.NODE_ENV === 'production') job.start();

const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
app.use(limiter);



app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});
app.use('/api/transactions', transactionsRoute);


initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
});