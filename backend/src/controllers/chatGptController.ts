import type { Request, Response } from 'express';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatGptService } from '../services/chatGptService';
import { displayTypes } from '../models/displayType';
import { scraperService } from '../services/scraperService';

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

  async summarizeArticle(req: Request, res: Response) {
    try {
      const { articleId, displayTypeId } = req.body as {
        articleId?: number;
        displayTypeId?: string;
      };

      if (!articleId || !displayTypeId) {
        return res.status(400).json({
          message: '`articleId` and `displayTypeId` are required.',
        });
      }

      const displayType = displayTypes.find((dt) => dt.id === displayTypeId);
      if (!displayType) {
        return res.status(400).json({
          message: `Invalid displayTypeId: "${displayTypeId}"`,
        });
      }

      // Non-textual display types (video/audio) are not supported yet
      const nonTextualTypes = ['video_reel_script', 'podcast_snippet'];
      if (nonTextualTypes.includes(displayTypeId)) {
        return res.status(200).json({
          content: 'COMING SOON!',
          displayType: displayType.name,
        });
      }

      const article = await scraperService.getArticleById(articleId);
      if (!article) {
        return res.status(404).json({
          message: `Article with id ${articleId} not found.`,
        });
      }

      const result = await chatGptService.generateArticleSummary(article.url, displayType);

      return res.status(200).json({
        content: result.content,
        estimatedReadTime: result.estimatedReadTime,
        displayType: displayType.name,
        articleId,
      });
    } catch (err: any) {
      console.error('Article summary error:', err);
      return res.status(500).json({
        message: 'Article summary request failed',
        error: err.message ?? 'Unknown error',
      });
    }
  }
}

export const chatGptController = new ChatGptController();
