import { prisma } from '../prisma';
import { ChatGptService } from './chatGptService';

interface ArticleData {
  title: string;
  summary?: string;
  category?: string;
}

interface CategoryGenerationResult {
  categories: string[];
  articleCategories: Record<number, string[]>;
}

export class CategoryService {
  private chatGptService: ChatGptService;

  constructor() {
    this.chatGptService = new ChatGptService();
  }

  // Get categories by source
  async getCategoriesBySource(source: string) {
    let categories = await prisma.category.findMany({
      where: { source },
    });

    // If no categories exist for this source, generate them
    if (categories.length === 0) {
      const generated = await this.generateCategoriesForSource(source);

      // Save generated categories to database
      for (const categoryName of generated.categories) {
        await prisma.category.create({
          data: { name: categoryName, source },
        });
      }

      // Save categories to each article
      await this.saveArticleCategories(generated.articleCategories);

      // Fetch the saved categories
      categories = await prisma.category.findMany({
        where: { source },
      });

      return {
        categories,
        articleCategories: generated.articleCategories,
      };
    }

    return { categories, articleCategories: {} };
  }

  // Generate categories using OpenAI
  private async generateCategoriesForSource(source: string): Promise<CategoryGenerationResult> {
    // Fetch all articles for this source
    const articles = await prisma.article.findMany({
      where: { source },
      select: { id: true, data: true },
    });

    if (articles.length === 0) {
      return { categories: [], articleCategories: {} };
    }

    console.log(`Generating categories for source: ${source} with ${articles.length} articles`);

    // Prepare article data for the prompt
    const articleSummaries = articles.map((article) => {
      const data = article.data as unknown as ArticleData;
      return {
        id: article.id,
        title: data.title || 'Untitled',
        summary: data.summary || '',
      };
    });

    const prompt = `You are a categorization expert. Analyze the following articles and create a categorization system.

Requirements:
1. Generate at least 10 distinct categories that cover all the articles
2. Each article can belong to multiple categories
3. Categories should be meaningful and descriptive

Articles:
${JSON.stringify(articleSummaries, null, 2)}

Respond with valid JSON only, no markdown, in this exact format:
{
  "categories": ["Category1", "Category2", ...],
  "articleCategories": {
    "articleId1": ["Category1", "Category2"],
    "articleId2": ["Category3"],
    ...
  }
}
  
**DO NOT** output anything other than the JSON object. No backticks, no explanations. Your response will be parsed directly. If you output anything else, the parsing will fail and that is considered an CRITICAL ERROR.`;

    const response = await this.chatGptService.generateCompletion([
      { role: 'system', content: 'You are a JSON API that categorizes articles. Respond only with valid JSON, no explanations.' },
      { role: 'user', content: prompt },
    ]);

    try {
      const parsed = JSON.parse(response.content) as CategoryGenerationResult;

      // Convert string keys to numbers for articleCategories
      const articleCategories: Record<number, string[]> = {};
      for (const [key, value] of Object.entries(parsed.articleCategories)) {
        articleCategories[parseInt(key)] = value;
      }

      return {
        categories: parsed.categories,
        articleCategories,
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response.content);
      throw new Error('Failed to generate categories');
    }
  }

  // Save categories to each article
  private async saveArticleCategories(articleCategories: Record<number, string[]>) {
    for (const [articleId, categories] of Object.entries(articleCategories)) {
      await prisma.article.update({
        where: { id: parseInt(articleId) },
        data: { categories },
      });
    }
  }
}

export const categoryService = new CategoryService();
