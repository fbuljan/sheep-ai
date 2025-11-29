import dotenv from 'dotenv';
import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { promptLibrary, getDisplayTypePrompt } from '../utils/prompts';
import type { PromptKey } from '../utils/prompts';
import { DisplayType } from '../models/displayType';

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

  async generateArticleSummary(articleUrl: string, displayType: DisplayType) {
    const client = await this.getClient();
    const systemPrompt = getDisplayTypePrompt(displayType);

    const response = await client.responses.create({
      model: this.model,
      tools: [{ type: 'web_search_preview' }],
      instructions: systemPrompt,
      input: `Please fetch and read the full article content from this URL: ${articleUrl}\n\nThen summarize it according to the instructions. Your output should be summary formatted with markdown. Include title/header.`,
    });

    const textOutput = response.output.find((item) => item.type === 'message');
    const initialContent =
      textOutput?.type === 'message'
        ? textOutput.content
            .filter((c): c is OpenAI.Responses.ResponseOutputText => c.type === 'output_text')
            .map((c) => c.text)
            .join('')
        : '';

    // Validation step: check if summary follows instructions and improve if needed
    const validatedContent = await this.validateAndImproveSummary(
      initialContent,
      systemPrompt
    );

    // Get estimated read time for the original article
    const estimatedReadTime = await this.estimateReadTime(articleUrl);

    return {
      content: validatedContent,
      estimatedReadTime,
      raw: response,
    };
  }

  async estimateReadTime(articleUrl: string): Promise<string> {
    const client = await this.getClient();

    const response = await client.responses.create({
      model: this.model,
      tools: [{ type: 'web_search_preview' }],
      instructions: `You are a read time estimator. Your task is to estimate how long it would take an average reader to read the full article content.

CRITICAL OUTPUT FORMAT REQUIREMENT:
- Your response MUST be EXACTLY in the format: "X mins" (where X is a number)
- Valid examples: "2 mins", "5 mins", "10 mins", "15 mins"
- Invalid examples: "About 5 minutes", "5 minutes to read", "Approximately 3 mins", "5"

RULES:
1. Output ONLY the time estimate - nothing else
2. Always use "mins" (not "minutes", "min", or "m")
3. Use a single number (not a range like "3-5 mins")
4. Do NOT include any explanation, context, or additional text
5. Do NOT include quotes around your response

Your entire response should be exactly like this: 5 mins`,
      input: `Please fetch and read the full article content from this URL: ${articleUrl}\n\nEstimate the read time based on the article length.`,
    });

    const textOutput = response.output.find((item) => item.type === 'message');
    const readTime =
      textOutput?.type === 'message'
        ? textOutput.content
            .filter((c): c is OpenAI.Responses.ResponseOutputText => c.type === 'output_text')
            .map((c) => c.text)
            .join('')
            .trim()
        : '3 mins';

    return readTime;
  }

  private async validateAndImproveSummary(
    summary: string,
    originalInstructions: string
  ): Promise<string> {
    const client = await this.getClient();

    const validationPrompt = `You are a quality assurance validator. Your task is to validate that a summary follows the given instructions and improve it if necessary.

ORIGINAL INSTRUCTIONS:
${originalInstructions}

GENERATED SUMMARY:
${summary}

VALIDATION TASK:
1. Check if the summary strictly follows ALL requirements from the original instructions
2. Check for any hallucinations, made-up information, or content that seems fabricated
3. Verify the format matches what was requested (length, structure, tone)
4. Ensure the output is properly formatted in markdown

RESPONSE:
- If the summary perfectly follows the instructions, return it EXACTLY as is (no changes)
- If improvements are needed, return an improved version that better follows the instructions
- Your output must be ONLY the final summary in markdown format - no explanations, no meta-commentary
- Do NOT add any prefix like "Here's the improved version" - just output the summary directly`;

    const response = await client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: validationPrompt,
        },
        {
          role: 'user',
          content: 'Please validate and return the summary.',
        },
      ],
    });

    return response.choices[0]?.message?.content ?? summary;
  }

  async convertMarkdownToHtml(markdown: string): Promise<string> {
    const client = await this.getClient();

    const response = await client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `You are a markdown to HTML converter. Convert the given markdown to clean, email-safe HTML.
Use inline styles for formatting (no external CSS).
Use these styles:
- Headers: font-weight bold, appropriate font sizes
- Paragraphs: margin-bottom 16px, line-height 1.6
- Lists: proper list styling with padding
- Bold/italic: appropriate font-weight/style
- Links: color #667eea

Return ONLY the HTML content, no explanation or markdown code blocks.`,
        },
        {
          role: 'user',
          content: markdown,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  }
}
