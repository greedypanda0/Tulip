import { useMemo } from "react";

const cats = [
  "/cat1.png",
  "/cat2.png",
  "/cat3.png",
  "/cat4.png",
  "/cat5.png",
  "/dog1.png",
];

type FloatingCat = {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
};

export const Background: React.FC = () => {
  const catCount = localStorage.getItem("catGod") ? 1000 : 30;

  const floatingCats = useMemo<FloatingCat[]>(
    () =>
      Array.from({ length: catCount }, (_, index) => ({
        id: index,
        src: cats[index % cats.length],
        x: random(0, 100),
        y: random(0, 100),
        width: random(48, 96),
        duration: random(10, 30),
        delay: random(0, 10),
        opacity: random(0.08, 0.2),
      })),
    [catCount],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {floatingCats.map((cat) => (
        <div
          key={cat.id}
          className="absolute animate-float"
          style={{
            left: `${cat.x}vw`,
            top: `${cat.y}vh`,
            animationDuration: `${cat.duration}s`,
            animationDelay: `${cat.delay}s`,
          }}
        >
          <img
            src={cat.src}
            alt=""
            className="animate-wobble"
            style={{
              width: `${cat.width}px`,
              height: `100%`,
              opacity: cat.opacity,
              filter: "drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.2))",
            }}
          />
        </div>
      ))}
    </div>
  );
};

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
