import React from "react";
import { Board, renderBoard } from "./PuzzleBoard";
import { solveProblem } from "./SolverBackend";

type PuzzleSolverState = {
    problemUrl: string,
    error?: string,
    message?: string,
    board?: Board,
};

export class PuzzleSolver extends React.Component<{}, PuzzleSolverState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            problemUrl: "",
        };
    }

    render() {
        const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                problemUrl: e.target.value,
            });
        };

        const solve = () => {
            const url = this.state.problemUrl;

            const start = Date.now();
            const result = solveProblem(url);
            const elapsed = (Date.now() - start) / 1000;

            if (typeof result === "string") {
                this.setState({
                    error: result,
                    board: undefined,
                    message: undefined,
                });
            } else {
                this.setState({
                    error: undefined,
                    board: result,
                    message: "Done! (" + elapsed + "[s])",
                })
            }
        };

        return (
            <div>
                <div>
                    <span> Problem URL: </span>
                    <input type="text" value={this.state.problemUrl} size={40} onChange={changeUrl} />
                    <input type="button" value="Solve" onClick={solve} />
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
