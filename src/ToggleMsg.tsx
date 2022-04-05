import React from "react";

type ToggleMsgProps = {
    title: string,
};

type ToggleMsgState = {
    displayed: boolean,
};

export class ToggleMsg extends React.Component<ToggleMsgProps, ToggleMsgState> {
    constructor(props: ToggleMsgProps) {
        super(props);

        this.state = {
            displayed: false,
        };
    }

    render() {
        const toggle = () => {
            this.setState({ displayed: !this.state.displayed });
        };
        return (
            <div style={{borderWidth: 1, borderStyle: "solid", borderColor: "black"}}>
                <div style={{backgroundColor: "#ddddff", cursor: "pointer"}} onClick={toggle}>
                    {this.props.title}
                </div>
                {
                    this.state.displayed && this.props.children
                }
            </div>
        );
    }
}
