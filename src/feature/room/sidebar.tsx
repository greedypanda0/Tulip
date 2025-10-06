"use client";
import { useState } from "react";
import { FaTools, FaUsers } from "react-icons/fa";
import clsx from "clsx";
import Members from "./members";
import Tools from "./tools";
import { FaMessage } from "react-icons/fa6";
import Chats from "./chats";
import { Socket } from "socket.io-client";

export default function Sidebar({
  roomMembers,
  socket,
}: {
  roomMembers: { room: string; name: string; userId: string }[];
  socket: Socket | null;
}) {
  const [activeTab, setActiveTab] = useState("tools");

  const tabs = [
    {
      id: "tools",
      icon: <FaTools />,
      name: "Tools",
      color: "bg-amber-400",
      bgColor: "bg-amber-200",
      component: <Tools />,
    },
    {
      id: "users",
      icon: <FaUsers />,
      name: "Users",
      color: "bg-teal-400",
      bgColor: "bg-teal-200",
      component: <Members roomMembers={roomMembers} />,
    },
    {
      id: "chats",
      icon: <FaMessage />,
      name: "Chats",
      color: "bg-sky-400",
      bgColor: "bg-sky-200",
      component: <Chats socket={socket} />,
    },
  ];
  const tab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="w-sm h-full bg-yellow-200 flex flex-col border-r-4 border-black">
      {/* Tabs Row */}
      <div className="flex flex-row w-full h-16 border-b-4 border-black justify-start px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "h-full w-16 flex justify-center items-center text-black text-xl font-extrabold border-2 border-black rounded-t-xl transition-all duration-150 mx-1",
                isActive
                  ? `${tab.color} shadow-[3px_3px_0px_#000] translate-y-0`
                  : "bg-yellow-100 translate-y-[4px] opacity-80 hover:opacity-100"
              )}
            >
              {tab.icon}
            </button>
          );
        })}
      </div>

      {/* Content below tabs */}
      <div
        className={clsx(
          "w-full h-full p-4 font-bold text-black flex flex-col gap-4",
          tab?.bgColor || "bg-yellow-100"
        )}
      >
        <div className="p-3 border-2 bg-white border-black rounded-lg shadow-[3px_3px_0px_#000]">
          👥 {tab?.name} Panel
        </div>
        {tab?.component}
      </div>
    </div>
  );
}
