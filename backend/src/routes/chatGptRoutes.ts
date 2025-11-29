import { Router } from 'express';
import { chatGptController } from '../controllers/chatGptController';

export const chatGptRouter = Router();

// POST /chatgpt
chatGptRouter.post('/', (req, res) => chatGptController.complete(req, res));
