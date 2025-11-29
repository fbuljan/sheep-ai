import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { chatGptRouter } from './routes/chatGptRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);

app.use('/chatgpt', chatGptRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
