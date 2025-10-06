import { Server } from "socket.io";
import http from "http";

interface User {
  userId: string; // stable ID from client
  socketId: string; // current connection
  name: string;
  room: string;
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  points: Point[];
  color?: string;
  strokeWidth?: number;
  eraser?: boolean;
}

const rooms: Record<string, User[]> = {};
const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // --- JOIN ROOM ---
  socket.on(
    "join_room",
    (data: { userId: string; name: string; room: string }) => {
      const { userId, name, room } = data;
      if (!rooms[room]) rooms[room] = [];

      // Remove previous connections from same user
      rooms[room] = rooms[room].filter((u) => u.userId !== userId);

      const user: User = { userId, socketId: socket.id, name, room };
      rooms[room].push(user);
      socket.join(room);

      io.to(room).emit("user_joined", rooms[room]);
      console.log(`${name} joined ${room}`);
    }
  );

  // --- DRAWING ---
  socket.on("draw", (segments: Segment[]) => {
    const userRoom = Object.values(rooms)
      .flat()
      .find((u) => u.socketId === socket.id)?.room;

    if (userRoom) {
      // Broadcast to all *other* clients in that room
      socket.to(userRoom).emit("draw", segments);
    }
  });

  // --- CHAT ---
  socket.on(
    "chat",
    (data: { name: string; userId: string; message: string }) => {
      const userRoom = Object.values(rooms)
        .flat()
        .find((u) => u.socketId === socket.id)?.room;

      if (userRoom) {
        io.to(userRoom).emit("chat", data);
      }
    }
  );

  // --- DISCONNECT ---
  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((u) => u.socketId !== socket.id);
      io.to(room).emit("user_left", rooms[room]);
    }
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
