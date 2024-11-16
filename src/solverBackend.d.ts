import { Result } from "./puzzleBoard";

// TODO: merge "noAnswer" into "success"
export type SolverResult = {
  status: "success",
  url: string,
  result: Result,
  elapsed: number,
} | {
  status: "error",
  url: string,
  error: string,
} | {
  status: "terminated",
  url: string,
} | {
  status: "noAnswer",
  url: string,
};

declare function solveProblem(url: string, numAnswers?: number): Promise<SolverResult>;
declare function terminateWorker(): void;
