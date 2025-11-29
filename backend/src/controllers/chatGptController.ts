import type { Request, Response } from 'express';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatGptService } from '../services/chatGptService';

const chatGptService = new ChatGptService();

export class ChatGptController {
  async complete(req: Request, res: Response) {
    try {
      const { messages } = req.body as {
        messages?: ChatCompletionMessageParam[];
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          message: '`messages` array is required.',
        });
      }

      const result = await chatGptService.generateCompletion(messages);

      return res.status(200).json({
        content: result.content,
        usage: result.usage,
      });
    } catch (err: any) {
      console.error('ChatGPT error:', err);
      return res.status(500).json({
        message: 'ChatGPT request failed',
        error: err.message ?? 'Unknown error',
      });
    }
  }
}

export const chatGptController = new ChatGptController();
