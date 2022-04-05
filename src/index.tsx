import React from 'react';
import ReactDOM from 'react-dom';
import { PuzzleSolver } from "./PuzzleSolver";
import { SolverReadme } from "./SolverReadme";

ReactDOM.render(
  <React.StrictMode>
    <SolverReadme />
    <PuzzleSolver />
  </React.StrictMode>,
  document.getElementById('root')
);
