import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
  socket: WebSocket | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export function SocketProvider({
  children,
  name,
  room,
}: {
  children: React.ReactNode;
  name: string;
  room: string;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080/ws?name=${name}&room=${room}`,
    );

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [name, room]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
