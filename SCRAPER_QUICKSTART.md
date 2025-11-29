# Quick Start Guide - Web Scraper

## Step 1: Install Dependencies

```bash
cd backend
nvm use 20
npm install
```

## Step 2: Run Database Migration

```bash
npx prisma migrate dev --name add_articles
npx prisma generate
```

## Step 3: Start the Backend Server

```bash
npm run dev
```

Server will start on http://localhost:4000

## Step 4: Run Initial Scrape

Open a new terminal and run:

```bash
curl -X POST http://localhost:4000/api/scraper/scrape/initial
```

This will scrape the last month of articles from The Hacker News (approximately 10 pages).

**Note:** This may take 1-2 minutes as it scrapes multiple pages with delays between requests.

## Step 5: View Articles

```bash
curl http://localhost:4000/api/scraper/articles?limit=10
```

Or open Prisma Studio to view the database:

```bash
cd backend
npx prisma studio
```

## Step 6: Daily Scraping

The daily scraper is **automatically started** when you run the server (configured in `.env`).

It runs every day at midnight to get new articles.

You can also manually trigger a daily scrape:

```bash
curl -X POST http://localhost:4000/api/scraper/scrape/daily
```

## Check Scheduler Status

```bash
curl http://localhost:4000/api/scraper/scheduler/status
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scraper/articles` | Get all articles |
| GET | `/api/scraper/articles/:id` | Get single article |
| POST | `/api/scraper/scrape/initial` | Initial scrape (last month) |
| POST | `/api/scraper/scrape/daily` | Daily scrape (new articles) |
| POST | `/api/scraper/scheduler/start` | Start scheduler |
| POST | `/api/scraper/scheduler/stop` | Stop scheduler |
| GET | `/api/scraper/scheduler/status` | Scheduler status |
| DELETE | `/api/scraper/articles/cleanup/30` | Delete articles older than 30 days |

## Example Article Data Structure

Each article is stored as JSON:

```json
{
  "title": "Article title",
  "summary": "Article description",
  "url": "https://...",
  "imageUrl": "https://...",
  "category": "Cyber Attack"
}
```

## Files Created

- `backend/src/services/scraperService.ts` - Main scraper logic
- `backend/src/services/schedulerService.ts` - Daily scheduler
- `backend/src/routes/scraperRoutes.ts` - API routes
- `backend/prisma/schema.prisma` - Added Article model

## Troubleshooting

**If migration fails:**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev --name init
```

**If Prisma Client errors:**
```bash
npx prisma generate
```

**Check database:**
```bash
npx prisma studio
```
