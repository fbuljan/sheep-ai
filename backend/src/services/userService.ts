import { Preferences, SourceCategoryPreference, User } from '../models/user';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export class UserService {
  async getUserById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }

  async updatePreferredWebsites(
    userId: number,
    preferredWebsites: string[]
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferredWebsites: preferredWebsites as Prisma.JsonArray,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }

  async updatePhoneNumber(
    userId: number,
    phoneNumber: string | null
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }

  async setSourceCategories(
    userId: number,
    source: string,
    categories: string[]
  ): Promise<SourceCategoryPreference> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { code: 'P2025' };
    }

    const preferences = (user.preferences as unknown as Preferences) || {};
    const sourceCategories: SourceCategoryPreference[] = preferences.sourceCategories || [];

    // Update or add the source categories
    const existingIndex = sourceCategories.findIndex((sc) => sc.source === source);
    if (existingIndex >= 0) {
      sourceCategories[existingIndex].categories = categories;
    } else {
      sourceCategories.push({ source, categories });
    }

    // Update preferences without overwriting other fields
    const updatedPreferences = {
      ...preferences,
      sourceCategories,
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: updatedPreferences as unknown as Prisma.JsonObject,
      },
    });

    return { source, categories };
  }

  async getSourceCategories(
    userId: number,
    source: string
  ): Promise<SourceCategoryPreference | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const preferences = (user.preferences as unknown as Preferences) || {};
    const sourceCategories: SourceCategoryPreference[] = preferences.sourceCategories || [];

    return sourceCategories.find((sc) => sc.source === source) || null;
  }

  async getArticlesByPreferredCategories(userId: number, source: string, limit?: number) {
    // Get user's preferred categories for this source
    const preference = await this.getSourceCategories(userId, source);

    if (!preference || preference.categories.length === 0) {
      return { articles: [], preferredCategories: [] };
    }

    // Get all articles from this source that have categories assigned
    const articles = await prisma.article.findMany({
      where: {
        source,
        NOT: { categories: { equals: Prisma.DbNull } },
      },
      orderBy: { scrapedAt: 'desc' },
    });

    // Filter articles that have at least one matching category
    const filteredArticles = articles.filter((article) => {
      const articleCategories = article.categories as unknown as string[];
      if (!articleCategories || !Array.isArray(articleCategories)) {
        return false;
      }
      return articleCategories.some((cat) => preference.categories.includes(cat));
    });

    // Apply limit if provided
    const limitedArticles = limit ? filteredArticles.slice(0, limit) : filteredArticles;

    return {
      articles: limitedArticles.map((article) => ({
        id: article.id,
        url: article.url,
        scrapedAt: article.scrapedAt,
        source: article.source,
        data: article.data,
        categories: article.categories,
      })),
      preferredCategories: preference.categories,
    };
  }
}
