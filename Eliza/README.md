# Eliza - AI Chatbot

A full-stack chatbot application powered by TinyLlama, with user authentication, intent detection, and external API integrations.

## Project Structure

```
.
├── backend/                 # FastAPI backend (Python)
│   ├── API.py               # Main application, routes
│   ├── model/
│   │   └── generator.py     # Groq API client and inference
│   ├── logic/
│   │   ├── rooter.py        # Intent detection
│   │   ├── context.py       # Conversation history management
│   │   ├── api_extern.py    # External sports API integration
│   │   └── cars_api.py      # External cars API integration
│   ├── utils/
│   │   └── logger.py        # Logging configuration
├── frontend/                # React frontend (Vite)
│   ├── src/
│   │   ├── pages/           # Login, Register, Chat pages
│   │   ├── components/      # ChatMessage, TypingIndicator
│   │   └── context/         # AuthContext (token management)
│   ├── Dockerfile           # Multi-stage build (Node + Nginx)
│   └── nginx.conf           # Nginx reverse proxy config
├── Dockerfile               # Backend Docker image
├── docker-compose.yml       # Full stack orchestration
└── requirements.txt         # Python dependencies
```

## Features

- Real-time chat powered by Groq API (LLaMA 3.1 8B)
- User authentication (register/login) with in-memory storage
- Per-user conversation history (last 10 messages)
- Intent detection (sport, car, weather, greeting, help, general)
- External sports API integration (thesportsdb.com)
- Responsive dark-themed UI with sidebar

## Getting Started

### Prerequisites

- Docker and Docker Compose
- A Groq API key ([get one free here](https://console.groq.com))
- A HuggingFace token ([get one here](https://huggingface.co/settings/tokens))

### Environment Setup

Create a `.env` file at the project root:

```
HF_TOKEN=your_huggingface_token
GROQ_API_KEY=your_groq_api_key
```

### Running with Docker (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

To run in the background:

```bash
docker-compose up --build -d
```

To view logs:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

To stop:

```bash
docker-compose down
```

### Running without Docker

**Backend:**

```bash
pip install -r requirements.txt
cd backend
uvicorn API:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Backend

### API Endpoints

| Method | Route       | Description                   |
|--------|-------------|-------------------------------|
| GET    | `/health`   | Server health check           |
| POST   | `/register` | Create a new user account     |
| POST   | `/login`    | Authenticate and get a token  |
| POST   | `/chat`     | Send a message to the chatbot |

### POST /register & POST /login

**Request:**
```json
{
  "username": "john",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "token-john",
  "username": "john"
}
```

### POST /chat

**Request:**
```json
{
  "message": "parle moi de la ferrari"
}
```

**Response:**
```json
{
  "intent": "car",
  "response": "La Ferrari est une marque italienne fondée en 1939..."
}
```

### Model

- Provider: [Groq](https://console.groq.com)
- Model: `llama-3.1-8b-instant`
- Max tokens: 300
- Personality: Eliza, a kind and calm assistant that responds simply and politely

### Intent Detection

Keyword-based intent detection in `rooter.py`:

| Intent     | Keywords / Trigger                                      |
|------------|---------------------------------------------------------|
| `weather`  | météo, weather, temps                                   |
| `greeting` | bonjour, salut, slt, hello, hi, hey                     |
| `help`     | aide, help, comment réussir, comment faire              |
| `sport`    | match, foot, football, sport (whole word only)          |
| `car`      | voiture, car, auto, moteur, sportive + known car brands |
| `general`  | (default fallback)                                      |

### Logging

Logs are written to `chatbot.log` with the format `%(asctime)s - %(levelname)s - %(message)s`.

## Frontend

### Tech Stack

- React 18 with Vite
- React Router for client-side routing
- Vanilla CSS (no framework)

### Pages

- **Login** (`/login`): Sign in with username and password
- **Register** (`/register`): Create a new account
- **Chat** (`/`): Main chat interface (requires authentication)

### Architecture

- `AuthContext` manages authentication state and stores the token in localStorage
- Protected routes redirect unauthenticated users to `/login`
- API calls go through `/api/` proxied to the backend by Nginx

## Docker

Two services defined in `docker-compose.yml`:

- **backend**: Python 3.11-slim running uvicorn on port 8000
- **frontend**: Multi-stage build (Node 20 + Nginx) on port 3000