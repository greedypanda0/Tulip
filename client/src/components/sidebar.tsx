import { Brush, MessageCircle, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { SidebarTools } from "./tools";
import { SidebarChat } from "./chat";
import { SidebarMembers } from "./members";

const icons = [
  {
    icon: Brush,
    color: "bg-primary",
  },
  {
    icon: MessageCircle,
    color: "bg-secondary",
  },
  {
    icon: Users,
    color: "bg-accent",
  },
];

export const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-full border-t-0 border-l-4 border-border-custom bg-surface flex flex-col z-20 w-86 shrink-0">
      <div className="flex flex-row w-full h-13">
        {icons.map((Icon, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={
              "flex-1 flex justify-center items-center rounded-t-3xl mx-2 mt-1 font-fredoka font-bold text-sm transition-all duration-150 " +
              (index === activeIndex
                ? "scale-110 border-border-custom border-t-2 translate-y-1 " +
                  Icon.color
                : "text-white")
            }
          >
            <Icon.icon />
          </div>
        ))}
      </div>
      {activeIndex === 0 && <SidebarTools />}
      {activeIndex === 1 && <SidebarChat />}
      {activeIndex === 2 && <SidebarMembers />}
    </div>
  );
};
