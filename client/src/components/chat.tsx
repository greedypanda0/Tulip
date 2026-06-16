import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../context/socket";
interface ChatMessage {
  message: string;
  name: string | null;
}

export const SidebarChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages([...messages, data.data]);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, messages]);

  const handleSubmit = () => {
    const msg = message.trim();
    if (!msg) return;

    if (socket) {
      const name = localStorage.getItem("name");
      socket.send(
        JSON.stringify({
          type: "chat",
          data: {
            message: msg,
            name,
          },
        }),
      );
    }

    setMessage("");
  };

  return (
    <div className="flex-1 min-h-0 bg-secondary flex flex-col">
      <div className="mx-2 my-4 flex items-center gap-2 shrink-0">
        <MessageCircle size={22} className="shrink-0" />

        <input
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Type a message..."
          className="w-full rounded-xl border-2 border-border-custom bg-primary-hover px-3 py-2 font-fredoka outline-none"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <span className="font-fredoka font-bold">{msg.name ?? "Anonymous"}:</span> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};
