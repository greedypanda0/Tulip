import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import useUserData from "@/hooks/use-data";
import { useCanvas } from "@/context/canvas-context";

export interface Message {
  name: string;
  userId: string;
  message: string;
}

export default function Chats({ socket }: { socket: Socket | null }) {
  const { chats, setChats } = useCanvas();
  const [input, setInput] = useState("");
  const { name, userId } = useUserData();

  // listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleChat = (data: Message) => {
      setChats([...chats, data]);
    };

    socket.on("chat", handleChat);
    return () => {
      socket.off("chat", handleChat);
    };
  }, [socket, setChats, chats]);

  // send message
  const sendMessage = () => {
    if (!name || !userId) return;
    if (!socket || !input.trim()) return;

    socket.emit("chat", { name, userId, message: input.trim() });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_#000]">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 p-2">
        {chats.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-2 rounded-lg border border-black shadow-[2px_2px_0_#000] text-sm ${
              msg.userId === userId
                ? "bg-yellow-200 self-end ml-auto"
                : "bg-sky-200 self-start mr-auto"
            }`}
          >
            <div className="font-semibold text-xs mb-1">{msg.name}</div>
            <div>{msg.message}</div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 border-t border-gray-300 pt-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0_#000] focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="p-2 border-2 border-black rounded-lg shadow-[2px_2px_0_#000] bg-sky-300 hover:bg-sky-400 transition-all"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
