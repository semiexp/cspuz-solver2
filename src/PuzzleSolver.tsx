import React from "react";
import { Result, renderBoard } from "./PuzzleBoard";
import { solveProblem, terminateWorker } from "./SolverBackend";
import { solveDoublechocoProblem, terminateDoublechocoWorker } from "./DoublechocoSolverBackend";
import { AnswerViewer } from "./AnswerViewer";

type PuzzleSolverState = {
    problemUrl: string,
    error?: string,
    message?: string,
    result?: Result,
    solverRunning: boolean,
    doublechoco: boolean,
    numMaxAnswer: number,
};

export class PuzzleSolver extends React.Component<{}, PuzzleSolverState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            problemUrl: "",
            solverRunning: false,
            doublechoco: false,
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

            const doublechoco = url.startsWith("https://puzz.link/p?dbchoco");

            this.setState({
                error: undefined,
                result: undefined,
                message: "Now solving...",
                solverRunning: true,
                doublechoco,
            });

            const start = Date.now();

            try {
                const result = doublechoco ? await solveDoublechocoProblem(url) : await solveProblem(url, enumerateAnswers ? 100 : 0);
                const elapsed = (Date.now() - start) / 1000;

                if (typeof result === "string") {
                    this.setState({
                        error: result,
                        result: undefined,
                        message: undefined,
                        solverRunning: false,
                        doublechoco: false,
                    });
                } else {
                    this.setState({
                        error: undefined,
                        result: result,
                        message: "Done! (" + elapsed + "[s])",
                        solverRunning: false,
                        doublechoco: false,
                    })
                }
            } catch (e: any) {
                this.setState({
                    error: e,
                    result: undefined,
                    message: undefined,
                    solverRunning: false,
                    doublechoco: false,
                });
            }
        };
        const stop = () => {
            if (this.state.doublechoco) {
                terminateDoublechocoWorker();
            } else {
                terminateWorker();
            }
        };

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
                {
                    this.state.error &&
                    <div style={{color: "red"}}>Error: {this.state.error}</div>
                }
                {
                    this.state.message &&
                    <div style={{color: "blue"}}>{this.state.message}</div>
                }
                {
                    this.state.result && <AnswerViewer result={this.state.result} />
                }
            </div>
        )
    }
}
