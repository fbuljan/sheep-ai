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
