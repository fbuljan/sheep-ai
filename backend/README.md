## Sheep AI Backend

Minimal Express API with in-memory auth for quick prototyping.

## Endpoints

- `GET /api/health` — Basic readiness check.  
  - Input: none.  
  - Output: `200` with `{"status":"ok"}`.

- `POST /auth/register` — Create a new user (stored in memory).  
  - Input (JSON body):  
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "secret123",
      "preferredWebsites": ["example.com", "news.com"],
      "preferences": { "theme": "dark" },    // optional
      "phoneNumber": "+123456789"            // optional
    }
    ```  
  - Output: `201` with the user record (no `passwordHash`), e.g.:  
    ```json
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "preferredWebsites": ["example.com", "news.com"],
      "preferences": { "theme": "dark" },
      "phoneNumber": "+123456789"
    }
    ```  
  - Errors: `400` if email is already used or payload is invalid.

- `POST /auth/login` — Authenticate an existing user.  
  - Input (JSON body):  
    ```json
    {
      "email": "jane@example.com",
      "password": "secret123"
    }
    ```  
  - Output: `200` with the safe user and a signed JWT (HS256, 1h expiry, secret `JWT_SECRET`):  
    ```json
    {
      "user": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "preferredWebsites": ["example.com", "news.com"],
        "preferences": { "theme": "dark" },
        "phoneNumber": "+123456789"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```  
  - Errors: `401` for invalid credentials.

### Scraper Endpoints

- `GET /api/scraper/articles` — Get all scraped articles.
  - Query parameters (optional):
    - `limit` — Maximum number of articles to return (e.g., `?limit=10`)
    - `source` — Filter by source (e.g., `?source=thehackernews`)
  - Output: `200` with articles array:
    ```json
    {
      "success": true,
      "count": 10,
      "articles": [
        {
          "id": 1,
          "url": "https://example.com/article",
          "scrapedAt": "2025-11-29T10:00:00.000Z",
          "source": "thehackernews",
          "data": {
            "title": "Article Title",
            "summary": "Article summary...",
            "url": "https://example.com/article",
            "imageUrl": "https://example.com/image.jpg",
            "category": "Cyber Attack"
          }
        }
      ]
    }
    ```

- `GET /api/scraper/articles/:id` — Get a single article by ID.
  - Output: `200` with article object, or `404` if not found.

- `POST /api/scraper/scrape/initial` — Trigger initial scrape (last month of articles).
  - Input: none.
  - Output: `200` with scrape results:
    ```json
    {
      "success": true,
      "message": "Initial scrape completed. Saved 150 articles.",
      "count": 150
    }
    ```

- `POST /api/scraper/scrape/daily` — Trigger daily scrape (latest articles only).
  - Input: none.
  - Output: `200` with scrape results:
    ```json
    {
      "success": true,
      "message": "Daily scrape completed. Saved 20 articles.",
      "count": 20
    }
    ```

- `POST /api/scraper/scheduler/start` — Start the daily scraping scheduler.
  - Input: none.
  - Output: `200` with confirmation:
    ```json
    {
      "success": true,
      "message": "Daily scheduler started"
    }
    ```

- `POST /api/scraper/scheduler/stop` — Stop the daily scraping scheduler.
  - Input: none.
  - Output: `200` with confirmation.

- `GET /api/scraper/scheduler/status` — Get scheduler status.
  - Output: `200` with status:
    ```json
    {
      "success": true,
      "isRunning": true,
      "schedule": "Daily at midnight (0 0 * * *)"
    }
    ```

- `DELETE /api/scraper/articles/cleanup/:days` — Delete articles older than specified days.
  - Path parameter: `days` — Number of days to keep (e.g., `/cleanup/30`)
  - Output: `200` with deletion count:
    ```json
    {
      "success": true,
      "message": "Deleted 50 articles older than 30 days",
      "count": 50
    }
    ```

### ChatGPT & Notification Endpoints

- `POST /chatgpt` — Proxy to OpenAI chat completions.
  - Input (JSON body):
    ```json
    {
      "messages": [
        { "role": "user", "content": "Say hi to Sheep AI." }
      ]
    }
    ```
  - Output: `200` with the generated text and usage details, e.g.:
    ```json
    {
      "content": "Hello from Sheep AI!",
      "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 6,
        "total_tokens": 16
      }
    }
    ```
  - Errors: `400` if `messages` is missing/empty, `500` if the OpenAI request fails. Requires `OPENAI_API_KEY` in the environment.

- `POST /chatgpt/article-summary` — Generate a summary of an article in the specified display type format.
  - Input (JSON body):
    ```json
    {
      "articleId": 1,
      "displayTypeId": "micro_summary"
    }
    ```
  - Output: `200` with the generated summary:
    ```json
    {
      "content": "Generated summary text...",
      "estimatedReadTime": "5 mins",
      "displayType": "Micro Summary",
      "articleId": 1
    }
    ```
  - Behavior:
    - Fetches the article from the database and uses OpenAI with web search to read the full article content from the URL.
    - Generates a summary according to the display type's prompt template.
    - Estimates the read time for the original article (format: "X mins").
    - For non-textual display types (`video_reel_script`, `podcast_snippet`), returns `"COMING SOON!"` as content.
  - Errors: `400` if `articleId` or `displayTypeId` is missing/invalid, `404` if article not found, `500` if OpenAI request fails.

- `GET /notifications/types` — Get all available notification types.
  - Input: none.
  - Output: `200` with array of notification types:
    ```json
    [
      { "key": "none", "label": "None" },
      { "key": "email", "label": "Email" },
      { "key": "whatsapp", "label": "Whatsapp" },
      { "key": "both", "label": "Both" }
    ]
    ```

- `GET /notifications/frequencies` — Get all available notification frequencies.
  - Input: none.
  - Output: `200` with array of notification frequencies:
    ```json
    [
      { "key": "daily", "label": "Daily" },
      { "key": "weekly", "label": "Weekly" },
      { "key": "monthly", "label": "Monthly" }
    ]
    ```

- `GET /notifications/preferences/:userId` — Get notification preferences for a user.
  - Input: `userId` path parameter.
  - Output: `200` with notification preferences or `null` if not set:
    ```json
    { 
      "notificationType": "email",
      "notificationFrequency": "daily"
    }
    ```
  - Errors: `400` if user not found or invalid user ID.

- `PUT /notifications/preferences/:userId` — Save notification preferences for a user.
  - Input: `userId` path parameter and JSON body (at least one field required):
    ```json
    {
      "notificationType": "email",
      "notificationFrequency": "weekly"
    }
    ```
  - Output: `200` with saved preferences:
    ```json
    {
      "notificationType": "email",
      "notificationFrequency": "weekly"
    }
    ```
  - Errors: `400` if user not found, invalid user ID, or neither `notificationType` nor `notificationFrequency` is provided.
  - Note: This merges with existing notification preferences - you can update just one field without losing the other.
  - **Scheduler**: When both `notificationType` and `notificationFrequency` are set, a notification is automatically scheduled. For demo purposes, notifications are sent every 30 seconds regardless of the frequency setting. If `notificationType` is set to `none`, any scheduled notification is cancelled.

### User Endpoints

- `GET /users/:id` — Get user by ID.
  - Input: `id` path parameter.
  - Output: `200` with user object (no `passwordHash`):
    ```json
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "preferredWebsites": ["example.com", "news.com"],
      "preferences": { "theme": "dark" },
      "phoneNumber": "+123456789"
    }
    ```
  - Errors: `404` if user not found.

- `PUT /users/:id/preferred-websites` — Update user's preferred websites.
  - Input: `id` path parameter and JSON body:
    ```json
    {
      "preferredWebsites": ["site1.com", "site2.com", "site3.com"]
    }
    ```
  - Output: `200` with updated user object.
  - Errors: `400` if `preferredWebsites` is missing or not an array, `404` if user not found.

- `PUT /users/:id/phone-number` — Update user's phone number.
  - Input: `id` path parameter and JSON body:
    ```json
    {
      "phoneNumber": "+123456789"
    }
    ```
  - Output: `200` with updated user object.
  - Errors: `400` if `phoneNumber` is missing, `404` if user not found.
  - Note: Set `phoneNumber` to `null` to remove the phone number.

- `PUT /users/:id/categories/:source` — Set user's preferred categories for a source.
  - Input: `id` and `source` path parameters, and JSON body:
    ```json
    {
      "categories": ["Cybersecurity", "Data Breach", "Malware"]
    }
    ```
  - Output: `200` with saved preference:
    ```json
    {
      "source": "thehackernews",
      "categories": ["Cybersecurity", "Data Breach", "Malware"]
    }
    ```
  - Errors: `400` if `categories` is missing or not an array, `404` if user not found.
  - Note: This updates or creates the category preference for the specified source without overwriting other preferences.

- `GET /users/:id/categories/:source` — Get user's preferred categories for a source.
  - Input: `id` and `source` path parameters.
  - Output: `200` with preference object:
    ```json
    {
      "source": "thehackernews",
      "categories": ["Cybersecurity", "Data Breach", "Malware"]
    }
    ```
  - Note: Returns empty `categories` array if no preferences are set for that source.

- `GET /users/:id/articles/:source` — Get articles filtered by user's preferred categories for a source.
  - Input: `id` and `source` path parameters.
  - Query parameters (optional):
    - `limit` — Maximum number of articles to return (e.g., `?limit=10`)
  - Output: `200` with filtered articles:
    ```json
    {
      "success": true,
      "count": 5,
      "preferredCategories": ["Cybersecurity", "Data Breach"],
      "articles": [
        {
          "id": 1,
          "url": "https://example.com/article",
          "scrapedAt": "2025-11-29T10:00:00.000Z",
          "source": "thehackernews",
          "data": {
            "title": "Article Title",
            "summary": "Article summary..."
          },
          "categories": ["Cybersecurity", "Malware"]
        }
      ]
    }
    ```
  - Behavior: Returns only articles from the specified source that have at least one category matching the user's preferred categories.
  - Note: Returns empty `articles` array if user has no preferred categories set for this source.

### Category Endpoints

- `GET /categories/:source` — Get categories for a specific source.
  - Input: `source` path parameter (e.g., `thehackernews`).
  - Output: `200` with categories and article mappings:
    ```json
    {
      "success": true,
      "categories": [
        { "id": 1, "name": "Cybersecurity", "source": "thehackernews" },
        { "id": 2, "name": "Data Breach", "source": "thehackernews" }
      ],
      "articleCategories": {
        "1": ["Cybersecurity", "Data Breach"],
        "2": ["Malware", "Ransomware"]
      }
    }
    ```
  - Behavior:
    - If categories already exist for the source, returns them from the database.
    - If no categories exist, generates them using OpenAI by analyzing all articles for that source, saves them to the database, and returns them with article-to-category mappings.
  - Note: `articleCategories` maps article IDs to their assigned categories. This is only populated when categories are freshly generated.

### Display types

- `GET /display-types` — Get all available display types for article summaries.
  - Input: none.
  - Output: `200` with array of display types:
    ```json
    [
      {
        "id": "micro_summary",
        "name": "Micro Summary",
        "format": "Ultra-compressed, one-sentence summary",
        "purpose": "Used in the feed; fastest way to decide if you want to open the article"
      },
      {
        "id": "tech_bullets",
        "name": "Tech Bullets",
        "format": "Short, precise bullet points (3-5 key points)",
        "purpose": "Best for technical readers (devs, secops, analysts)"
      }
      // ... more types
    ]
    ```

- `POST /display-types/preferences` — Save user's preferred display types.
  - Input (JSON body):
    ```json
    {
      "userId": 1,
      "displayTypeIds": ["micro_summary", "tech_bullets", "executive_summary"]
    }
    ```
  - Output: `200` with success message:
    ```json
    { "message": "Preferences saved successfully" }
    ```
  - Errors: `400` if `userId` or `displayTypeIds` is invalid, `404` if user not found.

- `GET /display-types/preferences/:userId` — Get user's preferred display types as full objects.
  - Input: `userId` as URL parameter.
  - Output: `200` with array of display type objects the user has selected:
    ```json
    [
      {
        "id": "micro_summary",
        "name": "Micro Summary",
        "format": "Ultra-compressed, one-sentence summary",
        "purpose": "Used in the feed; fastest way to decide if you want to open the article"
      }
    ]
    ```
  - Errors: `400` if `userId` is invalid, `404` if user not found.