import React from "react";
import { Board, renderBoard } from "./PuzzleBoard";
import { solveProblem, terminateWorker } from "./SolverBackend";

type PuzzleSolverState = {
    problemUrl: string,
    error?: string,
    message?: string,
    board?: Board,
    solverRunning: boolean,
};

export class PuzzleSolver extends React.Component<{}, PuzzleSolverState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            problemUrl: "",
            solverRunning: false,
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

            this.setState({
                error: undefined,
                board: undefined,
                message: "Now solving...",
                solverRunning: true,
            });

            const start = Date.now();

            try {
                const result = await solveProblem(url);
                const elapsed = (Date.now() - start) / 1000;

                if (typeof result === "string") {
                    this.setState({
                        error: result,
                        board: undefined,
                        message: undefined,
                        solverRunning: false,
                    });
                } else {
                    this.setState({
                        error: undefined,
                        board: result,
                        message: "Done! (" + elapsed + "[s])",
                        solverRunning: false,
                    })
                }
            } catch (e: any) {
                this.setState({
                    error: e,
                    board: undefined,
                    message: undefined,
                    solverRunning: false,
                });
            }
        };
        const stop = () => {
            terminateWorker();
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
