import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PuzzleSolver } from "./puzzleSolver";

import "./main.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h2>
      cspuz-solver2
    </h2>
    <p>
      <a href="/">トップへ戻る</a>
    </p>
    <PuzzleSolver />
  </StrictMode>,
)
