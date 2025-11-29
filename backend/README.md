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
