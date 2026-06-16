import { SquareArrowRightExit } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-surface flex items-center justify-between px-4">
      <h1 className="text-4xl md:text-5xl font-black font-fredoka tracking-tight text-accent">
        Tulip<span className="text-primary">Draw</span>
      </h1>

      <div className="w-35">
        <Button
          className="bg-red-500"
          onClick={handleLeave}
          icon={<SquareArrowRightExit />}
        >
          Leave
        </Button>
      </div>
    </div>
  );
};
