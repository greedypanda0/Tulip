# Tulip - Collaborative Drawing App Documentation

## Project Overview

Tulip is a real-time collaborative drawing application built with Next.js, React, and Socket.IO. It features a playful, cartoon-style UI with bright colors and bold design elements. Users can join rooms, draw together, and chat in real-time.

## Tech Stack

- **Frontend**: Next.js 15.5.4, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4.0, Custom CSS
- **Drawing**: Konva.js, React-Konva
- **Real-time Communication**: Socket.IO
- **Development**: ESLint, TSX for server development

## Project Structure

```
tulip/
├── public/               # Static assets
├── server/              # Socket.IO server
├── src/
│   ├── app/             # Next.js app directory
│   ├── context/         # React context providers
│   ├── feature/         # Feature-based components
│   └── hooks/           # Custom React hooks
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint configuration
├── postcss.config.mjs   # PostCSS configuration
└── next.config.ts       # Next.js configuration
```

## Configuration Files

### package.json
- **Project Name**: tulip
- **Version**: 0.1.0
- **Scripts**:
  - `dev:web`: Runs Next.js dev server with Turbopack
  - `dev:server`: Runs Socket.IO server with TSX
  - `dev`: Runs both servers (though the command seems incorrect)
  - `build`: Builds the Next.js app with Turbopack
  - `start`: Starts production Next.js server
  - `lint`: Runs ESLint

**Key Dependencies**:
- `next`: 15.5.4 (React framework)
- `react`: 19.1.0
- `konva`: 10.0.2 (2D canvas library)
- `react-konva`: 19.0.10 (React wrapper for Konva)
- `socket.io`: 4.8.1 (real-time communication)
- `socket.io-client`: 4.8.1
- `clsx`: 2.1.1 (conditional CSS classes)
- `react-icons`: 5.5.0

### tsconfig.json
- Target: ES2017
- Module resolution: bundler
- Path mapping: `@/*` → `./src/*`
- Includes Next.js plugin and strict TypeScript settings

### next.config.ts
- Minimal configuration with default Next.js setup

### eslint.config.mjs
- Extends Next.js core web vitals and TypeScript rules
- Ignores build directories and generated files

### postcss.config.mjs
- Configured for Tailwind CSS v4 with `@tailwindcss/postcss` plugin

## Application Structure

### App Directory (`src/app/`)

#### layout.tsx
- Root layout component using Next.js App Router
- Configures Geist fonts (sans and mono variants)
- Sets up basic HTML structure with font variables
- Applies global CSS classes for typography

#### globals.css
- Tailwind CSS imports
- CSS custom properties for theming (light/dark mode support)
- Custom font family configuration
- Full-height body/html styling

#### (site)/page.tsx
- Home page component (client-side)
- Renders the `JoinPage` component for room joining functionality

#### (site)/room/[room]/page.tsx
- Dynamic room page with server-side props
- Extracts room parameter from URL
- Renders `RoomPage` component with room data

### Components (`src/app/components/`)

#### login-dialog.tsx
- Modal dialog for user authentication
- Handles name input and generates random UUID for userId
- Stores user data in localStorage
- Features cartoon-style design with bright colors and shadows
- Auto-reloads page after successful login

### Features (`src/feature/`)

#### Home Feature (`src/feature/home/`)

##### join-page.tsx
- Landing page for joining rooms
- Cartoon-style UI with animated elements and bright colors
- Features:
  - Floating animated shapes (bouncing circles)
  - Room name input with validation
  - Navigation to room pages
  - Integration with login dialog
  - Responsive design with gradients

#### Room Feature (`src/feature/room/`)

##### room-page.tsx
- Main room container component
- Integrates user data and socket connection
- Layout: Sidebar + Canvas in flex row

##### canvas.tsx
- Real-time collaborative drawing canvas using Konva
- Features:
  - Mouse-based drawing (down, move, up events)
  - Line segments with customizable color and stroke width
  - Real-time synchronization via Socket.IO
  - Responsive canvas sizing
  - Local drawing with server broadcast

**Key Interfaces**:
- `Point`: x, y coordinates
- `Segment`: array of points with styling options
- `CanvasProps`: socket, color, strokeWidth

##### sidebar.tsx
- Tabbed sidebar interface with Tools and Users sections
- Cartoon-style design with colored tabs
- Dynamic tab switching with visual feedback
- Integrates Tools and Members components

##### members.tsx
- Displays room members list
- Features:
  - Room information with copy functionality
  - Member avatars (first letter of name)
  - Member details (name, truncated userId)
  - Empty state handling
  - Alternating row colors for better UX

##### tools.tsx
- Drawing tools panel
- Features:
  - Pencil/Eraser mode toggle
  - Stroke width adjustment (1-50px)
  - Color picker with paint brush icon
  - Visual feedback for active tools
  - Integrates with canvas context

##### chats.tsx
- Real-time chat functionality
- Features:
  - Message display with sender identification
  - Visual distinction between own/other messages
  - Input field with send button
  - Enter key support for sending
  - Integration with socket for real-time messaging

**Message Interface**:
- `name`: string
- `userId`: string  
- `message`: string

### Context (`src/context/`)

#### canvas-context.tsx
- Global state management for canvas and chat
- Manages:
  - Drawing settings (color, strokeWidth, eraserMode)
  - Chat messages array
  - State setters for all properties
- Provides `useCanvas` hook for consuming components

### Hooks (`src/hooks/`)

#### use-data.tsx
- Custom hook for user data management
- Retrieves `userId` and `name` from localStorage
- Client-side only (handles SSR safely)

#### use-socket.tsx
- Socket.IO connection management
- Features:
  - Auto-connection to localhost:4000
  - Room joining with user data
  - Real-time user list updates
  - Reconnection handling
  - Proper cleanup on unmount

**Interfaces**:
- `UseSocketOptions`: room, name, userId (all optional)
- `User`: userId, socketId, name, room

## Server (`server/index.ts`)

### Socket.IO Server
- HTTP server with CORS enabled for all origins
- Port: 4000

### Features:
1. **Room Management**:
   - Users can join rooms with userId, name, room
   - Prevents duplicate users (same userId)
   - Broadcasts user lists on join/leave

2. **Real-time Drawing**:
   - Receives drawing segments from clients
   - Broadcasts to all other clients in the same room
   - Supports color, stroke width, and eraser mode

3. **Chat System**:
   - Real-time message broadcasting
   - Messages include name, userId, and message content

4. **Connection Handling**:
   - Tracks user connections and rooms
   - Cleanup on disconnect
   - Console logging for debugging

**Key Interfaces**:
- `User`: userId, socketId, name, room
- `Point`: x, y coordinates
- `Segment`: points array with optional styling

## Styling Approach

### Design System
- **Theme**: Cartoon/playful style with bright colors
- **Colors**: Yellow (#FEF08A), Pink (#EC4899), Blue gradients
- **Typography**: Geist font family, bold weights
- **Shadows**: Custom box shadows (e.g., `shadow-[3px_3px_0px_#000]`)
- **Borders**: Consistent 2px black borders
- **Animations**: Bounce effects, rotation transforms

### CSS Framework
- Tailwind CSS v4 with custom theme integration
- Custom properties for light/dark mode support
- Utility-first approach with component-specific styles

## Key Features

1. **Real-time Collaboration**: Multiple users can draw simultaneously
2. **Room-based Sessions**: Users join specific rooms via URL
3. **Drawing Tools**: Pencil, eraser, color picker, stroke width
4. **User Management**: Simple name-based authentication
5. **Chat System**: Real-time messaging within rooms
6. **Responsive Design**: Works across different screen sizes
7. **Playful UI**: Cartoon-style design with animations

## Development Notes

### Running the Application
1. **Web Server**: `npm run dev:web` (Next.js on port 3000)
2. **Socket Server**: `npm run dev:server` (Socket.IO on port 4000)

### Socket.IO Communication
- **Client to Server**: `join_room`, `draw`, `chat`
- **Server to Client**: `user_joined`, `user_left`, `draw`, `chat`

### State Management
- Local component state for UI interactions
- Context API for global canvas/chat state
- localStorage for user persistence
- Socket.IO for real-time synchronization

### File Naming Conventions
- kebab-case for file names
- PascalCase for React components
- camelCase for functions and variables

## Future Enhancements

Based on the current structure, potential improvements could include:
1. User authentication system
2. Persistent room history
3. Drawing tools expansion (shapes, text)
4. File export/import functionality
5. Mobile touch support
6. Room permissions and moderation
7. Drawing layers management

## Dependencies Summary

### Production Dependencies
- Next.js ecosystem (next, react, react-dom)
- Drawing (konva, react-konva)
- Real-time (socket.io, socket.io-client)
- Utilities (clsx, react-icons)

### Development Dependencies
- TypeScript and type definitions
- ESLint with Next.js configuration
- Tailwind CSS v4
- TSX for server development

This documentation provides a comprehensive overview of the Tulip collaborative drawing application, covering all aspects from configuration to implementation details.