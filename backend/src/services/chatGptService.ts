import dotenv from 'dotenv';
import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { promptLibrary } from '../utils/prompts';
import type { PromptKey } from '../utils/prompts';

dotenv.config();

export class ChatGptService {
  private clientPromise: Promise<OpenAI>;
  private model: OpenAI.Chat.ChatModel;

  constructor(model?: OpenAI.Chat.ChatModel) {
    model ??= "gpt-4o";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY. Set it in your .env file.');
    }

    this.clientPromise = this.createClient(apiKey);
    this.model = model;
  }

  private async createClient(apiKey: string): Promise<OpenAI> {
    const OpenAI = (await import('openai')).default;
    return new OpenAI({ apiKey });
  }

  private async getClient() {
    return this.clientPromise;
  }

  async generateFromTemplate(
    promptKey: PromptKey,
    userContent: string,
    extras: ChatCompletionMessageParam[] = []
  ) {
    const messages = promptLibrary.buildMessages(promptKey, userContent, extras);
    return this.generateCompletion(messages);
  }

  async generateCompletion(messages: ChatCompletionMessageParam[]) {
    const client = await this.getClient();

    const response = await client.chat.completions.create({
      model: this.model,
      messages,
    });

    const [firstChoice] = response.choices;
    return {
      content: firstChoice?.message?.content ?? '',
      usage: response.usage,
      raw: response,
    };
  }
}
