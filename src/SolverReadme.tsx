import React from "react";
import { ToggleMsg } from "./ToggleMsg";
import { usageText } from "./ReadmeText";

export class SolverReadme extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return <div>
            <ToggleMsg title="使い方 / Usage">
                <div style={{whiteSpace: "pre-line"}}>
                    {usageText}
                </div>
                <div>
                    <a href="license.txt">
                        ライセンス情報 / Copyright notice
                    </a>
                </div>
            </ToggleMsg>
        </div>;
    }
}
