import React from "react";
import { Board, renderBoard } from "./PuzzleBoard";
import { solveProblem, terminateWorker } from "./SolverBackend";
import { solveDoublechocoProblem, terminateDoublechocoWorker } from "./DoublechocoSolverBackend";

type PuzzleSolverState = {
    problemUrl: string,
    error?: string,
    message?: string,
    board?: Board,
    solverRunning: boolean,
    doublechoco: boolean,
};

export class PuzzleSolver extends React.Component<{}, PuzzleSolverState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            problemUrl: "",
            solverRunning: false,
            doublechoco: false,
        };
    }

    render() {
        const solverRunning = this.state.solverRunning;
        const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                problemUrl: e.target.value,
            });
        };

        const solve = async () => {
            const url = this.state.problemUrl;

            const doublechoco = url.startsWith("https://puzz.link/p?dbchoco");

            this.setState({
                error: undefined,
                board: undefined,
                message: "Now solving...",
                solverRunning: true,
                doublechoco,
            });

            const start = Date.now();

            try {
                const result = doublechoco ? await solveDoublechocoProblem(url) : await solveProblem(url);
                const elapsed = (Date.now() - start) / 1000;

                if (typeof result === "string") {
                    this.setState({
                        error: result,
                        board: undefined,
                        message: undefined,
                        solverRunning: false,
                        doublechoco: false,
                    });
                } else {
                    this.setState({
                        error: undefined,
                        board: result,
                        message: "Done! (" + elapsed + "[s])",
                        solverRunning: false,
                        doublechoco: false,
                    })
                }
            } catch (e: any) {
                this.setState({
                    error: e,
                    board: undefined,
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
                    <input type="button" value="Solve" onClick={solve} disabled={solverRunning} />
                    <input type="button" value="Stop" onClick={stop} disabled={!solverRunning} />
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
                    this.state.board && renderBoard(this.state.board)
                }
            </div>
        )
    }
}
