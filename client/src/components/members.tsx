import { useEffect, useState } from "react";
import { useSocket } from "../context/socket";
interface Member {
  id: string;
  name: string;
}

export const SidebarMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "get_members",
      }),
    );

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "members") {
        setMembers(data.data);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return (
    <div className="flex-1 min-h-0 bg-accent p-4">
      <h2 className="mb-4 text-center text-lg font-bold">
        🌷 Room Members ({members.length})
      </h2>

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-border-custom bg-secondary px-3 py-2 shadow-[2px_2px_0px_var(--border)]"
          >
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />

            <span className="font-semibold text-text">{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
