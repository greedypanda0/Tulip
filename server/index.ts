import { Server } from "socket.io";
import http from "http";

interface User {
  userId: string;
  socketId: string;
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

// create HTTP server that responds to Render's health checks
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server is running 🚀");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join_room", (data: { userId: string; name: string; room: string }) => {
    const { userId, name, room } = data;
    if (!rooms[room]) rooms[room] = [];

    rooms[room] = rooms[room].filter((u) => u.userId !== userId);
    const user: User = { userId, socketId: socket.id, name, room };
    rooms[room].push(user);

    socket.join(room);
    io.to(room).emit("user_joined", rooms[room]);
    console.log(`${name} joined ${room}`);
  });

  socket.on("draw", (segments: Segment[]) => {
    const userRoom = Object.values(rooms)
      .flat()
      .find((u) => u.socketId === socket.id)?.room;

    if (userRoom) socket.to(userRoom).emit("draw", segments);
  });

  socket.on("chat", (data: { name: string; userId: string; message: string }) => {
    const userRoom = Object.values(rooms)
      .flat()
      .find((u) => u.socketId === socket.id)?.room;

    if (userRoom) io.to(userRoom).emit("chat", data);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((u) => u.socketId !== socket.id);
      io.to(room).emit("user_left", rooms[room]);
    }
    console.log("Disconnected:", socket.id);
  });
});

const PORT = Number(process.env.PORT) || 4000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
