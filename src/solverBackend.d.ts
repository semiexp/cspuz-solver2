import { Result } from "./puzzleBoard";

declare function solveProblem(url: string, numAnswers?: number): Promise<string | Result>;
declare function terminateWorker(): void;
