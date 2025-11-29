import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export type PromptKey = 'default' | 'summary' | 'recommendation';

const promptTemplates: Record<PromptKey, string> = {
  default:
    'You are Sheep AI, a concise assistant that helps users explore personalized website experiences and content ideas.',
  summary:
    'You summarize user preferences or browsing history into short bullet points with clear, actionable insights.',
  recommendation:
    'You propose tailored website or content recommendations that align with the provided interests and constraints. Keep answers direct and numbered.',
};

export const promptLibrary = {
  getPrompt(key: PromptKey) {
    return promptTemplates[key];
  },
  listKeys(): PromptKey[] {
    return Object.keys(promptTemplates) as PromptKey[];
  },
  buildMessages(key: PromptKey, userContent: string, extras: ChatCompletionMessageParam[] = []) {
    const systemPrompt = promptTemplates[key];
    if (!systemPrompt) {
      throw new Error(`Prompt template "${key}" not found`);
    }

    const base: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ];

    return [...base, ...extras];
  },
};
