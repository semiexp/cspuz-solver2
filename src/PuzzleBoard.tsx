import React from "react";
import { ReactElement } from "react";

export type Board = 
    | {
        kind: "grid",
        height: number,
        width: number,
        defaultStyle: "grid" | "dots",
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
    | "sideArrowUp"
    | "sideArrowDown"
    | "sideArrowLeft"
    | "sideArrowRight"
    | "cross"
    | "line"
    | "wall"
    | "boldWall"
    | { kind: "text", data: string };

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
            return <polygon points={points.join(" ")} stroke="none" fill="black" />
        } else if (typeof item === "string") {
            throw new Error("unsupported item: " + item);
        } else if ("kind" in item) {
            return <text x={centerX} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.8 }}>{item.data}</text>;
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
        }
        throw new Error("unsupported item: " + item);
    }
    throw new Error("items must be on either vertices, cells, or edges");
}

export function renderBoard(board: Board): ReactElement {
    const margin = 30;
    const unitSize = 30; 

    const env = {
        offsetY: margin,
        offsetX: margin,
        unitSize,
    };

    const components = [];

    for (let i = 0; i < board.data.length; ++i) {
        const elem = board.data[i];
        components.push(renderItem(env, elem.y, elem.x, elem.color, elem.item));
    }

    const height = board.height;
    const width = board.width;

    if (board.defaultStyle === "grid") {
        for (let y = 0; y <= height; ++y) {
            const lineWidth = (y === 0 || y === height) ? 2 : 1;
            components.push(<line x1={margin} x2={margin + width * unitSize} y1={margin + y * unitSize} y2={margin + y * unitSize} strokeWidth={lineWidth} stroke="black" />);
        }
        for (let x = 0; x <= width; ++x) {
            const lineWidth = (x === 0 || x === width) ? 2 : 1;
            components.push(<line x1={margin + x * unitSize} x2={margin + x * unitSize} y1={margin} y2={margin + height * unitSize} strokeWidth={lineWidth} stroke="black" />);
        }
    }

    const svgHeight = height * unitSize + margin * 2;
    const svgWidth = width * unitSize + margin * 2;

    return <svg height={svgHeight} width={svgWidth}>
        <g>
        {components}
        </g>
    </svg>;
}
