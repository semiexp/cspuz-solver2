import React from "react";
import { Result } from "./puzzleBoard";
import { solveProblem, terminateWorker } from "./solverBackend";
import { AnswerViewer } from "./answerViewer";

type PuzzleSolverState = {
  problemUrl: string,
  error?: string,
  message?: string,
  result?: Result,
  solverRunning: boolean,
  numMaxAnswer: number,
};

export class PuzzleSolver extends React.Component<{}, PuzzleSolverState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      problemUrl: "",
      solverRunning: false,
      numMaxAnswer: 100,
    };
  }

  render() {
    const solverRunning = this.state.solverRunning;
    const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        problemUrl: e.target.value,
      });
    };
    const changeNumMaxAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
      const n = parseInt(e.target.value);
      if (!isNaN(n) && n > 0) {
        this.setState({
          numMaxAnswer: n
        });
      }
    };

    const solve = async (enumerateAnswers: boolean) => {
      const url = this.state.problemUrl;

      this.setState({
        error: undefined,
        result: undefined,
        message: "Now solving...",
        solverRunning: true,
      });

      const start = Date.now();

      try {
        const result = await solveProblem(url, enumerateAnswers ? this.state.numMaxAnswer : 0);
        const elapsed = (Date.now() - start) / 1000;

        if (typeof result === "string") {
          this.setState({
            error: result,
            result: undefined,
            message: undefined,
            solverRunning: false,
          });
        } else {
          this.setState({
            error: undefined,
            result: result,
            message: "Done! (" + elapsed + "[s])",
            solverRunning: false,
          })
        }
      } catch (e: any) {
        this.setState({
          error: e,
          result: undefined,
          message: undefined,
          solverRunning: false,
        });
      }
    };
    const stop = () => {
        terminateWorker();
    };

    let isUnique;
    if (this.state.result !== undefined && !("answers" in this.state.result)) {
      isUnique = this.state.result.isUnique;
    } else {
      isUnique = undefined;
    }

    return (
      <div>
        <div>
          <span> Problem URL: </span>
          <input type="text" value={this.state.problemUrl} size={40} onChange={changeUrl} />
          <input type="button" value="Solve" onClick={() => solve(false)} disabled={solverRunning} />
          <input type="button" value="List Answers" onClick={() => solve(true)} disabled={solverRunning} />
          <input type="button" value="Stop" onClick={stop} disabled={!solverRunning} />
          <span> Max # answers: </span>
          <input type="number" value={this.state.numMaxAnswer} min={1} step={1} onChange={changeNumMaxAnswer} size={4} />
        </div>
        <div>
        {
          this.state.error &&
          <span style={{color: "red"}}>Error: {this.state.error}</span>
        }
        {
          this.state.message &&
          <span style={{color: "black"}}>{this.state.message}</span>
        }
        {
          isUnique === true &&
          <span style={{color: "blue"}}> Unique answer</span>
        }
        {
          isUnique === false &&
          <span style={{color: "red"}}> NOT unique answer (multiple answers)!</span>
        }
        </div>
        {
          this.state.result && <AnswerViewer result={this.state.result} />
        }
      </div>
    )
  }
}
