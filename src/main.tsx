import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PuzzleSolver } from "./puzzleSolver";

import "./main.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PuzzleSolver />
  </StrictMode>,
)
