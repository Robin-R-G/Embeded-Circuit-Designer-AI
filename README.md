# Embeded Circuit Designer AI 🚀

A modern, AI-powered web IDE for microcontrollers (ESP32, ESP8266). Describe your circuit behavior, and let the AI generate, compile, and fix your code automatically.

![Modern UI Mockup](https://raw.githubusercontent.com/Robin-R-G/Embeded-Circuit-Designer-AI/main/frontend/public/next.svg)

## ✨ Features

- **AI Auto-Pilot**: High-level prompt-to-code generation with automatic error correction.
- **Real-time Compilation**: Dockerized build workers for ESP32 and ESP8266.
- **Sleek Modern UI**: Glassmorphism design with an interactive, responsive interface.
- **Cloud Save**: Save and load your projects (requires authentication).
- **Live Logs**: Real-time terminal output during AI processing and compilation.

## 🛠 Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Monaco Editor, Lucide Icons.
- **Backend**: Fastify (Node.js), WebSockets, Prisma (SQLite).
- **AI**: OpenAI GPT-4o.
- **DevOps**: Docker, Localtunnel for public access.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Docker (for compilation)
- OpenAI API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Robin-R-G/Embeded-Circuit-Designer-AI.git
   cd Embeded-Circuit-Designer-AI
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Add your OPENAI_API_KEY
   npx prisma migrate dev
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Setup Compilation Workers**:
   ```bash
   cd ../workers
   docker build -t esp32-compiler -f Dockerfile.esp32 .
   ```

## 🌍 Public Access
To share your project publicly, use Localtunnel:
```bash
npx localtunnel --port 3000 # Frontend
npx localtunnel --port 3001 # Backend
```

## 📝 License
MIT
