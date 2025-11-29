import { Router } from 'express';
import { scraperService } from '../services/scraperService';
import { schedulerService } from '../services/schedulerService';

export const scraperRouter = Router();

// Get all articles
scraperRouter.get('/articles', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const source = req.query.source as string | undefined;

    const articles = await scraperService.getArticles(limit, source);

    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get single article by ID
scraperRouter.get('/articles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const article = await scraperService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }

    res.json({
      success: true,
      article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Trigger initial scrape (last month of data)
scraperRouter.post('/scrape/initial', async (req, res) => {
  try {
    const count = await scraperService.scrapeTheHackerNews(true);

    res.json({
      success: true,
      message: `Initial scrape completed. Saved ${count} articles.`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Trigger daily scrape (new articles only)
scraperRouter.post('/scrape/daily', async (req, res) => {
  try {
    const count = await scraperService.scrapeTheHackerNews(false);

    res.json({
      success: true,
      message: `Daily scrape completed. Saved ${count} articles.`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start daily scheduler
scraperRouter.post('/scheduler/start', (req, res) => {
  try {
    schedulerService.startDailyScraping();

    res.json({
      success: true,
      message: 'Daily scheduler started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Stop daily scheduler
scraperRouter.post('/scheduler/stop', (req, res) => {
  try {
    schedulerService.stopDailyScraping();

    res.json({
      success: true,
      message: 'Daily scheduler stopped',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get scheduler status
scraperRouter.get('/scheduler/status', (req, res) => {
  try {
    const isRunning = schedulerService.isRunning();

    res.json({
      success: true,
      isRunning,
      schedule: 'Daily at midnight (0 0 * * *)',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Cleanup old articles
scraperRouter.delete('/articles/cleanup/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const count = await scraperService.cleanupOldArticles(days);

    res.json({
      success: true,
      message: `Deleted ${count} articles older than ${days} days`,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});