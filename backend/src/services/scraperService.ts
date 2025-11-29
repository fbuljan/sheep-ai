import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../prisma';

interface ArticleData {
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  category: string;
  publishedDate?: string;
  [key: string]: string | undefined;
}

export class ScraperService {

  // Scrape The Hacker News
  async scrapeTheHackerNews(initialScrape = false): Promise<number> {
    console.log('Starting scrape of The Hacker News...');

    try {
      const articles: ArticleData[] = [];

      // For initial scrape, get multiple pages (last month of data)
      const pagesToScrape = initialScrape ? 10 : 1;

      for (let page = 1; page <= pagesToScrape; page++) {
        const url = page === 1
          ? 'https://thehackernews.com'
          : `https://thehackernews.com/search?updated-max=${this.getDateOffset(page * 3)}&max-results=20`;

        console.log(`Scraping page ${page}...`);

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 30000,
        });

        const $ = cheerio.load(response.data);

        // Parse articles from the page
        $('.body-post').each((_, element) => {
          try {
            const $el = $(element);

            const title = $el.find('.home-title').text().trim();
            const summary = $el.find('.home-desc').text().trim();
            const articleUrl = $el.find('.story-link').attr('href') || '';
            const imageUrl = $el.find('.img-ratio img').attr('src') || '';
            const category = $el.find('.label-name').text().trim() || 'Uncategorized';

            if (title && articleUrl) {
              articles.push({
                title,
                summary: summary || title,
                url: articleUrl,
                imageUrl: imageUrl || undefined,
                category,
              });
            }
          } catch (err) {
            console.error('Error parsing article:', err);
          }
        });

        // Add delay between pages to be respectful
        if (page < pagesToScrape) {
          await this.delay(2000);
        }
      }

      console.log(`Found ${articles.length} articles`);

      // Save to database
      let savedCount = 0;
      for (const article of articles) {
        try {
          await prisma.article.upsert({
            where: { url: article.url },
            update: {
              data: article,
              scrapedAt: new Date(),
            },
            create: {
              url: article.url,
              data: article,
              source: 'thehackernews',
            },
          });
          savedCount++;
        } catch (error) {
          console.error(`Error saving article ${article.url}:`, error);
        }
      }

      console.log(`Saved ${savedCount} articles to database`);
      return savedCount;

    } catch (error) {
      console.error('Error scraping The Hacker News:', error);
      throw error;
    }
  }

  // Get all articles from database
  async getArticles(limit?: number, source?: string) {
    const articles = await prisma.article.findMany({
      where: source ? { source } : undefined,
      orderBy: { scrapedAt: 'desc' },
      take: limit,
    });

    return articles.map((article: { id: any; url: any; scrapedAt: any; source: any; data: any; }) => ({
      id: article.id,
      url: article.url,
      scrapedAt: article.scrapedAt,
      source: article.source,
      data: article.data,
    }));
  }

  // Get article by ID
  async getArticleById(id: number) {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) return null;

    return {
      id: article.id,
      url: article.url,
      scrapedAt: article.scrapedAt,
      source: article.source,
      data: article.data,
    };
  }

  // Delete old articles
  async cleanupOldArticles(daysToKeep = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.article.deleteMany({
      where: {
        scrapedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }

  // Helper: Add delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper: Get date offset for pagination
  private getDateOffset(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }
}

export const scraperService = new ScraperService();
