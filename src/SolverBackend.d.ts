import { Result } from "./PuzzleBoard";

declare async function solveProblem(url: string, numAnswers?: number): Promise<string | Result>;
declare function terminateWorker();
