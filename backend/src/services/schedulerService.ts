import cron, { ScheduledTask } from 'node-cron';
import { scraperService } from './scraperService';

export class SchedulerService {
  private dailyTask: ScheduledTask | null = null;

  // Start daily scraping at midnight
  startDailyScraping() {
    if (this.dailyTask) {
      console.log('Daily scraping already scheduled');
      return;
    }

    // Run every day at midnight (0 0 * * *)
    this.dailyTask = cron.schedule('0 0 * * *', async () => {
      console.log('Running scheduled daily scrape...');
      try {
        await scraperService.scrapeTheHackerNews(false);
        console.log('Daily scrape completed');
      } catch (error) {
        console.error('Daily scrape failed:', error);
      }
    });

    console.log('Daily scraping scheduled for midnight');
  }

  // Stop daily scraping
  stopDailyScraping() {
    if (this.dailyTask) {
      this.dailyTask.stop();
      this.dailyTask = null;
      console.log('Daily scraping stopped');
    }
  }

  // Check if scheduler is running
  isRunning(): boolean {
    return this.dailyTask !== null;
  }
}

export const schedulerService = new SchedulerService();
