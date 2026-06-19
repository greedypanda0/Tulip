# 🌷 Tulip

Tulip is a real-time collaborative whiteboard built with Go and WebSockets.

Create a room, invite others, draw together, chat, and see everyone's cursor move in real time.

## Features

- 🎨 Real-time drawing
- 💬 Room chat
- 👥 Live member list
- 🖱️ Live cursor tracking
- 🏠 Room-based collaboration
- ⚡ WebSocket-powered communication

## Tech Stack

### Backend

- Go
- Gorilla WebSocket
- slog

### Frontend

- React
- TypeScript
- TailwindCSS

## Running Locally

### Backend

```bash
git clone <repo>
cd server

go mod download
go run cmd/main.go
```

### Frontend

```bash
cd client

npm install
npm run dev
```

## Environment Variables

### Server

```env
PORT=8000
```

### Client

```env
VITE_SOCKET_URL=ws://localhost:8000/ws
```
