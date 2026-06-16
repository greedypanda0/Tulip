import { createContext, useContext } from "react";
import type { Board } from "../canvas/board";

export const BoardContext = createContext<Board | null>(null);

export function useBoard() {
  const board = useContext(BoardContext);

  return board;
}
