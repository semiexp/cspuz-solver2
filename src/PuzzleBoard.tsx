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
        } else if (typeof item === "string") {
            throw new Error("unsupported item: " + item);
        } else if ("kind" in item) {
            return <text x={centerX} y={centerY} dominantBaseline="central" textAnchor="middle" style={{ fontSize: unitSize * 0.8 }}>{item.data}</text>;
        }
        throw new Error("unsupported item: " + item);
    } else if (isEdge) {
        // TODO
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
