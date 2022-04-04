import { Board } from "./PuzzleBoard";

declare async function solveProblem(url: string): Promise<string | Board>;
declare function terminateWorker();
