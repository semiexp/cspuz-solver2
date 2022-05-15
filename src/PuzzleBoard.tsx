import React from "react";
import { ReactElement } from "react";

export type MultipleAnswers = { common: Board, answers: Board[] };
export type Result = Board | MultipleAnswers;

export type Board = 
    | {
        kind: "grid",
        height: number,
        width: number,
        defaultStyle: "outer_grid" | "grid" | "dots",
        data: {
            y: number,
            x: number,
            color: string,
            item: Item,
        }[],
    };

export type Item =
    | "dot"
    | "block"
    | "fill"
    | "circle"
    | "filledCircle"
    | "sideArrowUp"
    | "sideArrowDown"
    | "sideArrowLeft"
    | "sideArrowRight"
    | "aboloUpperLeft"
    | "aboloUpperRight"
    | "aboloLowerLeft"
    | "aboloLowerRight"
    | "cross"
    | "line"
    | "wall"
    | "boldWall"
    | "dottedHorizontalWall"
    | "dottedVerticalWall"
    | { kind: "text", data: string }
    | { kind: "compass", up: number, down: number, left: number, right: number }
    | { kind: "tapaClue", value: number[] };

type RenderEnv = {
    offsetY: number,
    offsetX: number,
    unitSize: number,
};

function renderItem(env: RenderEnv, y: number, x: number, color: string, item: Item): ReactElement {
    const isVertex = (y % 2 === 0 && x % 2 === 0);
    const isCell = (y % 2 === 1 && x % 2 === 1);
    const isEdge = !(isVertex || isCell);

    const unitSize = env.unitSize;
    if (isVertex) {
        throw new Error("items on vertices are not supported");
    } else if (isCell) {
        const centerY = env.offsetY + unitSize * (y / 2);
        const centerX = env.offsetX + unitSize * (x / 2);

        if (item === "dot") {
            return <rect x={centerX - unitSize * 0.1} y={centerY - unitSize * 0.1} width={unitSize * 0.2} height={unitSize * 0.2} fill={color} />;
        } else if (item === "block") {
            return <rect x={centerX - unitSize * 0.45} y={centerY - unitSize * 0.45} width={unitSize * 0.9} height={unitSize * 0.9} fill={color} />;
        } else if (item === "fill") {
            return <rect x={centerX - unitSize * 0.5} y={centerY - unitSize * 0.5} width={unitSize} height={unitSize} fill={color} />;
        } else if (item === "sideArrowUp" || item === "sideArrowDown" || item === "sideArrowLeft" || item === "sideArrowRight") {
            let shape = [
                [0.1, 0.1],
                [0.5, 0.1],
                [0.5, 0.05],
                [0.9, 0.125],
                [0.5, 0.2],
                [0.5, 0.15],
                [0.1, 0.15]
            ];
            let points = [];
            for (let i = 0; i < shape.length; ++i) {
                let dx = shape[i][0];
                let dy = shape[i][1];

                // affine transform
                if (item === "sideArrowLeft" || item === "sideArrowUp") {
                    dx = 1 - dx;
                }
                if (item === "sideArrowUp" || item === "sideArrowDown") {
                    let tmp = dx;
                    dx = dy;
                    dy = tmp;
                }

                // adjust to the cell
                dx = centerX + unitSize * (dx - 0.5);
                dy = centerY + unitSize * (dy - 0.5);
                points.push(String(dx) + "," + String(dy));
            }
            return <polygon points={points.join(" ")} stroke="none" fill={color} />
        } else if (item === "aboloUpperLeft") {
            return <polygon points={aboloPoints(centerY, centerX, unitSize, 2)} stroke="none" fill={color} />;
        } else if (item === "aboloUpperRight") {
            return <polygon points={aboloPoints(centerY, centerX, unitSize, 1)} stroke="none" fill={color} />;
        } else if (item === "aboloLowerLeft") {
            return <polygon points={aboloPoints(centerY, centerX, unitSize, 3)} stroke="none" fill={color} />;
        } else if (item === "aboloLowerRight") {
            return <polygon points={aboloPoints(centerY, centerX, unitSize, 0)} stroke="none" fill={color} />;
        } else if (item === "circle") {
            return <circle cx={centerX} cy={centerY} r={unitSize * 0.4} stroke={color} fill="none" />
        } else if (item === "filledCircle") {
            return <circle cx={centerX} cy={centerY} r={unitSize * 0.4} stroke={color} fill={color} />
        } else if (item === "dottedHorizontalWall") {
            return <line x1={centerX - unitSize / 2} x2={centerX + unitSize / 2} y1={centerY} y2={centerY} strokeWidth={2} stroke={color} strokeDasharray="4 2" />
        } else if (item === "dottedVerticalWall") {
            return <line x1={centerX} x2={centerX} y1={centerY - unitSize / 2} y2={centerY + unitSize / 2} strokeWidth={2} stroke={color} strokeDasharray="4 2" />
        } else if (typeof item === "string") {
            throw new Error("unsupported item: " + item);
        } else if ("kind" in item) {
            if (item.kind === "text") {
                return <text x={centerX} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.8 }} fill={color}>{item.data}</text>;
            } else if (item.kind === "compass") {
                return <g>
                    <line x1={centerX - unitSize / 2} x2={centerX + unitSize / 2} y1={centerY - unitSize / 2} y2={centerY + unitSize / 2} strokeWidth={1} stroke={color} />
                    <line x1={centerX - unitSize / 2} x2={centerX + unitSize / 2} y1={centerY + unitSize / 2} y2={centerY - unitSize / 2} strokeWidth={1} stroke={color} />
                    {
                        item.up >= 0 && <text x={centerX} y={centerY - unitSize * 0.3} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.4 }} fill={color}>{item.up}</text>
                    }
                    {
                        item.down >= 0 && <text x={centerX} y={centerY + unitSize * 0.3} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.4 }} fill={color}>{item.down}</text>
                    }
                    {
                        item.left >= 0 && <text x={centerX - unitSize * 0.3} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.4 }} fill={color}>{item.left}</text>
                    }
                    {
                        item.right >= 0 && <text x={centerX + unitSize * 0.3} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.4 }} fill={color}>{item.right}</text>
                    }
                </g>
            } else if (item.kind === "tapaClue") {
                let values = [];
                for (let i = 0; i < item.value.length; ++i) {
                    if (item.value[i] === -2) {
                        values.push("?");
                    } else if (item.value[i] !== -1) {
                        values.push(item.value[i] + "");
                    }
                }
                if (values.length === 1) {
                    return <text x={centerX} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.8 }} fill={color}>{values[0]}</text>;
                } else if (values.length === 2) {
                    return <g>
                        <text x={centerX - unitSize * 0.2} y={centerY - unitSize * 0.2} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[0]}</text>
                        <text x={centerX + unitSize * 0.2} y={centerY + unitSize * 0.2} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[1]}</text>
                    </g>;
                } else if (values.length === 3) {
                    return <g>
                        <text x={centerX - unitSize * 0.3} y={centerY - unitSize * 0.2} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[0]}</text>
                        <text x={centerX + unitSize * 0.3} y={centerY - unitSize * 0.2} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[1]}</text>
                        <text x={centerX} y={centerY + unitSize * 0.2} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[2]}</text>
                    </g>;
                } else if (values.length === 4) {
                    return <g>
                        <text x={centerX - unitSize * 0.3} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[0]}</text>
                        <text x={centerX} y={centerY - unitSize * 0.25} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[1]}</text>
                        <text x={centerX} y={centerY + unitSize * 0.25} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[2]}</text>
                        <text x={centerX + unitSize * 0.3} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.6 }} fill={color}>{values[3]}</text>
                    </g>;
                }
            }
        }
        throw new Error("unsupported item: " + item);
    } else if (isEdge) {
        const centerY = env.offsetY + unitSize * (y / 2);
        const centerX = env.offsetX + unitSize * (x / 2);

        if (item === "line") {
            if (y % 2 === 1) {
                return <line x1={centerX - unitSize / 2} x2={centerX + unitSize / 2} y1={centerY} y2={centerY} strokeWidth={2} stroke={color} />;
            } else {
                return <line x1={centerX} x2={centerX} y1={centerY - unitSize / 2} y2={centerY + unitSize / 2} strokeWidth={2} stroke={color} />;
            }
        } else if (item === "cross") {
            const crossSize = unitSize * 0.1;
            return <g>
                <line x1={centerX - crossSize} x2={centerX + crossSize} y1={centerY - crossSize} y2={centerY + crossSize} strokeWidth={1} stroke={color} />
                <line x1={centerX + crossSize} x2={centerX - crossSize} y1={centerY - crossSize} y2={centerY + crossSize} strokeWidth={1} stroke={color} />
            </g>
        } else if (item === "wall" || item === "boldWall") {
            const strokeWidth = (item === "boldWall" ? 2 : 1);
            if (y % 2 === 0) {
                return <line x1={centerX - unitSize / 2} x2={centerX + unitSize / 2} y1={centerY} y2={centerY} strokeWidth={strokeWidth} stroke={color} />;
            } else {
                return <line x1={centerX} x2={centerX} y1={centerY - unitSize / 2} y2={centerY + unitSize / 2} strokeWidth={strokeWidth} stroke={color} />;
            }
        }
        throw new Error("unsupported item: " + item);
    }
    throw new Error("items must be on either vertices, cells, or edges");
}

function aboloPoints(centerY: number, centerX: number, unitSize: number, skip: number): string {
    let ret = [];
    if (skip !== 0) {
        ret.push(`${centerX - unitSize / 2},${centerY - unitSize / 2}`);
    }
    if (skip !== 1) {
        ret.push(`${centerX - unitSize / 2},${centerY + unitSize / 2}`);
    }
    if (skip !== 2) {
        ret.push(`${centerX + unitSize / 2},${centerY + unitSize / 2}`);
    }
    if (skip !== 3) {
        ret.push(`${centerX + unitSize / 2},${centerY - unitSize / 2}`);
    }
    return ret.join(" ");
}

export function renderBoard(boards: Board[]): ReactElement {
    const margin = 30;
    const unitSize = 30; 

    const env = {
        offsetY: margin,
        offsetX: margin,
        unitSize,
    };

    const components = [];
    let heightMax = 0;
    let widthMax = 0;

    for (const board of boards) {
        for (let i = 0; i < board.data.length; ++i) {
            const elem = board.data[i];
            components.push(renderItem(env, elem.y, elem.x, elem.color, elem.item));
        }

        const height = board.height;
        const width = board.width;
        heightMax = Math.max(heightMax, height);
        widthMax = Math.max(widthMax, width);

        if (board.defaultStyle === "outer_grid") {
            components.push(<line x1={margin} x2={margin + width * unitSize} y1={margin} y2={margin} strokeWidth={2} stroke="black" />);
            components.push(<line x1={margin} x2={margin + width * unitSize} y1={margin + height * unitSize} y2={margin + height * unitSize} strokeWidth={2} stroke="black" />);
            components.push(<line x1={margin} x2={margin} y1={margin} y2={margin + height * unitSize} strokeWidth={2} stroke="black" />);
            components.push(<line x1={margin + width * unitSize} x2={margin + width * unitSize} y1={margin} y2={margin + height * unitSize} strokeWidth={2} stroke="black" />);
        } else if (board.defaultStyle === "grid") {
            for (let y = 0; y <= height; ++y) {
                const lineWidth = (y === 0 || y === height) ? 2 : 1;
                components.push(<line x1={margin} x2={margin + width * unitSize} y1={margin + y * unitSize} y2={margin + y * unitSize} strokeWidth={lineWidth} stroke="black" />);
            }
            for (let x = 0; x <= width; ++x) {
                const lineWidth = (x === 0 || x === width) ? 2 : 1;
                components.push(<line x1={margin + x * unitSize} x2={margin + x * unitSize} y1={margin} y2={margin + height * unitSize} strokeWidth={lineWidth} stroke="black" />);
            }
        } else if (board.defaultStyle === "dots") {
            const dotSizeHalf = unitSize / 10;
            for (let y = 0; y <= height; ++y) {
                for (let x = 0; x <= width; ++x) {
                    const centerY = env.offsetY + unitSize * y;
                    const centerX = env.offsetX + unitSize * x;
                    components.push(<rect x={centerX - dotSizeHalf} y={centerY - dotSizeHalf} height={dotSizeHalf * 2} width={dotSizeHalf * 2} fill="black" />);
                }
            }
        }
    }

    const svgHeight = heightMax * unitSize + margin * 2;
    const svgWidth = widthMax * unitSize + margin * 2;

    return <svg height={svgHeight} width={svgWidth} style={{backgroundColor: "#ffffff"}}>
        <g>
        {components}
        </g>
    </svg>;
}
