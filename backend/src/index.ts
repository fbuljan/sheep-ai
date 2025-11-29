import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { scraperRouter } from './routes/scraperRoutes';
import { schedulerService } from './services/schedulerService';
import { chatGptRouter } from './routes/chatGptRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { userRouter } from './routes/userRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { displayTypeRouter } from './routes/displayTypeRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/api/scraper', scraperRouter);

app.use('/chatgpt', chatGptRouter);

app.use('/notifications', notificationRouter);

app.use('/users', userRouter);

app.use('/categories', categoryRouter);
app.use('/display-types', displayTypeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Auto-start scheduler if enabled
  if (process.env.AUTO_START_SCHEDULER === 'true') {
    schedulerService.startDailyScraping();
    console.log('Daily scraper scheduler started');
  }
});
