# 🌷 Tulip - Collaborative Drawing App

A real-time collaborative drawing application where users can join rooms, draw together, and chat in real-time. Built with Next.js, React, and Socket.IO, featuring a playful cartoon-style UI.

## ✨ Features

- 🎨 **Real-time Collaborative Drawing** - Draw with friends simultaneously
- 🏠 **Room-based Sessions** - Join or create drawing rooms
- 💬 **Live Chat** - Chat with room members while drawing
- 🖌️ **Drawing Tools** - Pencil, eraser, color picker, adjustable stroke width
- 👥 **User Management** - Simple name-based authentication
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎭 **Playful UI** - Bright, cartoon-style design with animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15.5.4, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Drawing Canvas**: Konva.js + React-Konva
- **Real-time Communication**: Socket.IO
- **Development**: ESLint, TSX

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/greedypanda0/Tulip
cd tulip
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development servers

**Option 1 - Run both servers with one command:**
```bash
npm run dev
```

**Option 2 - Run servers separately:**

**Terminal 1 - Web App:**
```bash
npm run dev:web
```

**Terminal 2 - Socket.IO Server:**
```bash
npm run dev:server
```

### 4. Open the application
- Web App: [http://localhost:3000](http://localhost:3000)
- Socket.IO Server: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

```
tulip/
├── public/               # Static assets
├── server/              # Socket.IO server
│   └── index.ts         # Main server file
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── (site)/      # Main site pages
│   │   ├── components/  # Shared components
│   │   ├── globals.css  # Global styles
│   │   └── layout.tsx   # Root layout
│   ├── context/         # React context providers
│   │   └── canvas-context.tsx
│   ├── feature/         # Feature-based components
│   │   ├── home/        # Landing page
│   │   └── room/        # Room functionality
│   └── hooks/           # Custom React hooks
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 How to Use

### 1. Join a Room
- Enter your name when prompted
- Type a room name and click "Rock n Roll 🚀"
- Share the room name with friends to draw together

### 2. Drawing Tools
- **Pencil**: Default drawing tool
- **Eraser**: Switch to eraser mode
- **Color Picker**: Choose drawing colors
- **Stroke Width**: Adjust line thickness (1-50px)

### 3. Collaboration
- See other users' drawings in real-time
- Chat with room members
- View who's currently in the room

## 🔧 Available Scripts

**Development:**
- `npm run dev` - Start both web app and server concurrently
- `npm run dev:web` - Start Next.js development server only
- `npm run dev:server` - Start Socket.IO server with watch mode

**Production:**
- `npm run build` - Build Next.js application for production
- `npm run start` - Start both production servers
- `npm run start:web` - Start Next.js production server
- `npm run start:server` - Start server directly

**Other:**
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Frontend (Next.js)
- **App Router**: Uses Next.js 13+ app directory structure
- **Components**: Feature-based organization
- **State Management**: React Context + Custom hooks
- **Styling**: Tailwind CSS with custom design system

### Backend (Socket.IO)
- **Real-time Events**: Drawing, chat, user join/leave
- **Room Management**: Isolated drawing sessions
- **User Tracking**: Simple session-based user management

### Communication Flow
```
Client ←→ Socket.IO Server ←→ Other Clients
  ↓           ↓                    ↓
Drawing    Room Mgmt           Real-time
Events     User Lists          Updates
Chat       Broadcasting
```

## 🎨 Design System

The app features a cartoon-style design with:
- **Colors**: Bright yellows, pinks, and blues
- **Typography**: Geist font family with bold weights
- **Shadows**: Custom black drop shadows
- **Borders**: Consistent 2px black borders
- **Animations**: Bounce effects and hover states

## 🚀 Deployment

### Vercel (Recommended for Frontend)
```bash
npm run build
# Deploy to Vercel
```

### Socket.IO Server
Deploy the server separately on platforms like:
- Railway
- Render
- Heroku
- DigitalOcean

Update the socket connection URL in `src/hooks/use-socket.tsx`:
```typescript
const socket = io("YOUR_DEPLOYED_SERVER_URL", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Mobile touch events need optimization for better drawing experience

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Persistent room history
- [ ] Drawing shapes and text tools
- [ ] File export/import (PNG, SVG)
- [ ] Mobile touch optimizations
- [ ] Room permissions and moderation
- [ ] Drawing layers management
- [ ] Voice chat integration

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Made with ❤️ using Next.js and Socket.IO
