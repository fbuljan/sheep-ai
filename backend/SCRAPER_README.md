# Web Scraper - The Hacker News

Simple web scraper for The Hacker News that stores articles in a SQLite database.

## Features

- Scrapes articles from The Hacker News
- Initial scrape: Gets last month of articles (10 pages)
- Daily scrape: Gets only new articles from the last scrape
- Stores each article as JSON in the database
- Scheduled daily scraping at midnight
- REST API to control scraper and retrieve articles

## Setup

### 1. Install Dependencies

```bash
cd backend
nvm use 20
npm install
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name add_articles
```

This creates the `Article` table in your database.

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## Usage

### Start the Server

```bash
npm run dev
```

The server runs on port 4000 by default.

## API Endpoints

### Articles

**Get all articles**
```
GET /api/scraper/articles?limit=50
```

**Get single article**
```
GET /api/scraper/articles/:id
```

### Scraping

**Run initial scrape (last month of data)**
```
POST /api/scraper/scrape/initial
```

**Run daily scrape (new articles only)**
```
POST /api/scraper/scrape/daily
```

### Scheduler

**Start daily scheduler**
```
POST /api/scraper/scheduler/start
```

**Stop daily scheduler**
```
POST /api/scraper/scheduler/stop
```

**Get scheduler status**
```
GET /api/scraper/scheduler/status
```

### Cleanup

**Delete old articles**
```
DELETE /api/scraper/articles/cleanup/30
```
(Deletes articles older than 30 days)

## Workflow

### First Time Setup

1. Start the server
2. Run initial scrape to get last month of articles:
   ```bash
   curl -X POST http://localhost:4000/api/scraper/scrape/initial
   ```
3. The scheduler will automatically run daily at midnight

### Manual Operations

**Check articles:**
```bash
curl http://localhost:4000/api/scraper/articles?limit=10
```

**Manually trigger daily scrape:**
```bash
curl -X POST http://localhost:4000/api/scraper/scrape/daily
```

**Check scheduler status:**
```bash
curl http://localhost:4000/api/scraper/scheduler/status
```

## Database Schema

### Article Model

- `id`: Auto-increment ID
- `url`: Unique article URL
- `data`: JSON string containing:
  - `title`: Article title
  - `summary`: Article summary/description
  - `url`: Article URL
  - `imageUrl`: Article image (optional)
  - `category`: Article category
- `scrapedAt`: Timestamp when scraped
- `source`: Source site (e.g., "thehackernews")

## Environment Variables

Edit `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
AUTO_START_SCHEDULER=true
```

- `AUTO_START_SCHEDULER`: Set to `true` to automatically start daily scraping when server starts

## Customization

### To add more sites:

1. Create a new scrape method in `src/services/scraperService.ts`
2. Add corresponding routes in `src/routes/scraperRoutes.ts`
3. Each site saves to the same `Article` table with a different `source` value

### Example:

```typescript
async scrapeAnotherSite(initialScrape = false): Promise<number> {
  // Your scraping logic here
  // Save with source: 'anothersite'
}
```

## Notes

- The scraper is respectful with 2-second delays between pages
- Duplicate URLs are automatically handled (upsert)
- All article data is stored as JSON for flexibility
- Daily scheduler runs at midnight (cron: `0 0 * * *`)
