# Connect Four - Multiplayer Game

A real-time multiplayer Connect Four game built with React, Node.js, WebSockets, MySQL, and Kafka analytics. Features player vs player matchmaking, bot gameplay, leaderboards, and decoupled analytics using Kafka.

## 🎮 Features

- **Real-time Multiplayer**: Play against other players with WebSocket-based matchmaking
- **Bot Opponent**: Practice against an AI bot with intelligent move selection
- **Leaderboard System**: Track wins and see top players
- **Modern UI**: Beautiful, dark-themed interface with smooth animations
- **Game Analytics**: Kafka-powered analytics service tracking game metrics
- **Disconnect Handling**: 30-second grace period before declaring winner on disconnect
- **Session Management**: Reconnection support for dropped connections

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **WebSocket API** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express** - HTTP server
- **WebSocket (ws)** - Real-time bidirectional communication
- **MySQL** - Database for users, games, and leaderboard
- **Kafka (kafkajs)** - Event streaming for analytics

### Infrastructure
- **Docker Compose** - Containerized Kafka and Zookeeper

## 📁 Project Structure

```
Emitrr/
├── backend/
│   ├── analytics/
│   │   ├── producer.js      # Kafka producer for game events
│   │   └── event.js         # Kafka consumer for analytics
│   ├── db/
│   │   ├── mysql.js         # MySQL connection pool
│   │   └── schema.js        # Database operations
│   ├── game/
│   │   ├── botEngine.js     # AI bot logic
│   │   ├── constants.js     # Game constants
│   │   ├── gameLogic.js     # Core game rules
│   │   └── gameManner.js    # Game state management
│   ├── leaderboard/
│   │   └── leaderboardService.js  # Leaderboard API
│   ├── matchmaking/
│   │   └── queue.js         # Player matchmaking queue
│   ├── reconnect/
│   │   └── sessionManager.js # Session management
│   ├── utils/
│   │   └── timers.js        # Utility timers
│   ├── websocket.js         # WebSocket server
│   └── server.js            # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx           # Game board component
│   │   │   ├── LeaderBoard.jsx     # Leaderboard display
│   │   │   ├── ModeSelector.jsx    # Game mode selection
│   │   │   └── UsernameForm.jsx    # Username input
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Application styles
│   │   ├── index.css        # Global styles
│   │   ├── main.jsx         # React entry point
│   │   └── ws.js            # WebSocket client
│   ├── index.html
│   └── package.json
├── docker-compose.yml       # Kafka infrastructure
└── README.md               # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Docker** and **Docker Compose** (for Kafka)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Emitrr
```

### 2. Database Setup

Create a MySQL database and configure it:

```sql
CREATE DATABASE emitrr;
```

Update the database configuration in `backend/db/mysql.js`:

```javascript
export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "emitrr",
    waitForConnections: true,
    connectionLimit: 10
});
```

The database tables will be created automatically when users join games (via `getOrCreateUser` function).

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 4. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 5. Kafka Setup (Optional - for Analytics)

Start Kafka and Zookeeper using Docker Compose:

```bash
docker compose up -d
```

This will start:
- **Zookeeper** on port `2181`
- **Kafka** on port `9092`

To verify Kafka is running:

```bash
docker compose ps
```

## 🎯 Running the Application

### Development Mode

#### 1. Start Kafka (if using analytics)

```bash
docker compose up -d
```

#### 2. Start the Backend Server

```bash
cd backend
nodemon server.js
```

The server will start on `http://localhost:3000`

#### 3. Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 4. Start Analytics Consumer (Optional)

In another terminal:

```bash
cd backend
npm run analytics
```

This will start the Kafka consumer that processes game events and displays analytics.

### Production Build

#### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

#### Backend

```bash
cd backend
NODE_ENV=production node server.js
```

Or use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name emitrr-backend
```

## 🎮 How to Play

1. **Select Game Mode**:
   - **Play with Player**: Join the matchmaking queue to play against another human player
   - **Play with Bot**: Play against an AI opponent

2. **Enter Username**: Provide a unique username to identify yourself

3. **Make Moves**: Click on any column to drop your disc. The disc will fall to the lowest available slot

4. **Win Condition**: Connect four discs horizontally, vertically, or diagonally to win

5. **View Leaderboard**: Check the leaderboard to see top players by wins

## 🔌 API Documentation

### WebSocket Messages

#### Client → Server

**JOIN_QUEUE**
```json
{
  "type": "JOIN_QUEUE",
  "username": "player1",
  "mode": "PVP" | "BOT"
}
```

**DROP_DISC**
```json
{
  "type": "DROP_DISC",
  "gameId": "uuid",
  "column": 0-6,
  "player": 1 | 2
}
```

**RECONNECT**
```json
{
  "type": "RECONNECT",
  "gameId": "uuid",
  "username": "player1"
}
```

#### Server → Client

**CONNECTED**
```json
{
  "type": "CONNECTED",
  "payload": {
    "socketId": "uuid"
  }
}
```

**GAME_START**
```json
{
  "type": "GAME_START",
  "payload": {
    "gameId": "uuid",
    "player": 1 | 2,
    "opponent": "player2" | "BOT"
  }
}
```

**GAME_UPDATE**
```json
{
  "type": "GAME_UPDATE",
  "payload": {
    "board": [[0,0,0,...], ...],
    "lastMove": {
      "type": "MOVE" | "WIN" | "DRAW",
      "row": 0-5,
      "column": 0-6,
      "winner": 1 | 2
    }
  }
}
```

**GAME_OVER**
```json
{
  "type": "GAME_OVER",
  "payload": {
    "type": "WIN" | "DRAW",
    "winner": 1 | 2
  }
}
```

### REST API

**GET /leaderboard**
- Returns top 10 players by wins
- Response:
```json
[
  {
    "username": "player1",
    "wins": 5
  },
  ...
]
```

**GET /health**
- Health check endpoint
- Response:
```json
{
  "status": "ok"
}
```

## 🗄️ Database Schema

### Tables

**users**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR, UNIQUE)

**games**
- `id` (VARCHAR, PRIMARY KEY)
- `player1_id` (INT, FOREIGN KEY)
- `player2_id` (INT, FOREIGN KEY, NULLABLE)
- `winner_id` (INT, FOREIGN KEY, NULLABLE)
- `result` (VARCHAR) - "WIN" | "DRAW"
- `duration` (INT) - seconds
- `created_at` (TIMESTAMP)

**leaderboard**
- `user_id` (INT, PRIMARY KEY, FOREIGN KEY)
- `wins` (INT, DEFAULT 0)

## 📊 Kafka Analytics

The application uses Kafka for decoupled game analytics. When a game completes, an event is published to the `game-analytics` topic.

### Event Structure

```json
{
  "event": "GAME_COMPLETED",
  "gameId": "uuid",
  "players": {
    "p1": "player1",
    "p2": "player2" | "BOT"
  },
  "winner": "player1" | null,
  "result": "WIN" | "DRAW",
  "duration": 45,
  "timestamp": 1234567890
}
```

### Analytics Metrics

The analytics consumer tracks:
- **Total games played**
- **Average game duration**
- **Top winners** (most frequent winners)
- **Games per hour** (temporal distribution)
- **User-specific metrics** (wins per player)

### Running Analytics

```bash
cd backend
npm run analytics
```

The consumer will log analytics snapshots to the console whenever a game completes.

## 🐳 Docker Compose

The `docker-compose.yml` file includes:

- **Zookeeper**: Required for Kafka coordination
- **Kafka**: Message broker for analytics events

To start:

```bash
docker compose up -d
```

To stop:

```bash
docker compose down
```

To view logs:

```bash
docker compose logs -f kafka
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory (optional, currently using hardcoded values):

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=emitrr
KAFKA_BROKER=localhost:9092
PORT=3000
```

### Frontend Configuration

Update `frontend/src/ws.js` to use environment variables:

```javascript
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";
```

Then create `frontend/.env`:

```env
VITE_WS_URL=ws://localhost:3000/ws
```

## 🚢 Deployment

### Cloud Hosting Setup (Vercel + Render + Railway)

This guide covers deploying to:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Railway (MySQL)
- **Kafka**: Not hosted (analytics disabled in production)

### Prerequisites

1. Accounts on [Vercel](https://vercel.com), [Render](https://render.com), and [Railway](https://railway.app)
2. GitHub repository with your code
3. Railway MySQL database instance

### Step 1: Set Up MySQL Database on Railway

1. Go to [Railway](https://railway.app) and create a new project
2. Click **"New"** → **"Database"** → **"Add MySQL"**
3. Once created, go to the **"Variables"** tab and note down:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `emitrr-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free tier works, but consider paid for better performance

5. Add Environment Variables in Render:
   ```
   MYSQL_HOST=<from Railway>
   MYSQL_PORT=<from Railway>
   MYSQL_USER=<from Railway>
   MYSQL_PASSWORD=<from Railway>
   MYSQL_DATABASE=<from Railway>
   PORT=10000
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
   ```
   **Note**: Render provides a dynamic port via `PORT` env var. Don't set `KAFKA_BROKER` (leave it unset to disable Kafka).

6. Click **"Create Web Service"**
7. Note your Render backend URL (e.g., `https://emitrr-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_WS_URL=wss://your-render-backend.onrender.com/ws
   VITE_API_URL=your-render-backend.onrender.com
   ```
   **Important**: Use `wss://` (secure WebSocket) for production, not `ws://`

6. Click **"Deploy"**
7. Note your Vercel frontend URL (e.g., `https://emitrr.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
   ```
4. Save and redeploy

### Step 5: Initialize Database Tables

The tables will be created automatically when the first user joins a game. However, you can manually create them:

1. Connect to your Railway MySQL database using a MySQL client
2. Run the following SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(255) PRIMARY KEY,
    player1_id INT NOT NULL,
    player2_id INT,
    winner_id INT,
    result VARCHAR(50),
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
    user_id INT PRIMARY KEY,
    wins INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Step 6: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try creating a game (bot mode works best for testing)
3. Check Render logs for any errors
4. Verify database connection by checking if users are created

### Important Notes

- **WebSocket on Render**: Render supports WebSockets on paid plans. Free tier may have limitations
- **Database Connection**: Railway MySQL uses SSL. You may need to update `backend/db/mysql.js` to include SSL configuration if Railway requires it
- **CORS**: Always use HTTPS URLs in `ALLOWED_ORIGINS` for production
- **Environment Variables**: Never commit `.env` files. Use platform environment variable settings
- **Kafka**: Analytics are disabled in production since Kafka is not hosted. The app will work fine without it

### Alternative: VPS Deployment

If you prefer a traditional VPS setup, see the original deployment section below.

## 🐛 Troubleshooting

### Kafka Connection Errors

If you see `ECONNREFUSED` errors:
- Ensure Docker is running
- Check Kafka container: `docker compose ps`
- Verify Kafka is healthy: `docker compose logs kafka`

### WebSocket Connection Issues

- Check backend is running on port 3000
- Verify CORS settings allow your frontend origin
- Check firewall settings

### Database Connection Errors

- Verify MySQL is running
- Check credentials in `backend/db/mysql.js`
- Ensure database `emitrr` exists

### Matchmaking Not Working

- Ensure at least 2 players are in the queue
- Check WebSocket connections are active
- Verify queue logic in `backend/matchmaking/queue.js`



