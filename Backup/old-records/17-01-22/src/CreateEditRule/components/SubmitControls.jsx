import React, { Component } from "react";
import ReactDOM from "react-dom";
// material-ui
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Translate } from "orion-components/i18n/I18nContainer";

const styledButton = {
	containedRoot: {
		"&:hover": {
			backgroundColor: "rgba(0, 188, 212, 0.8)"
		},
		fontSize: "1em",
		width: 88,
		backgroundColor: "rgb(0, 188, 212)"

	},
	containedFocusVisible: {
		backgroundColor: "rgba(0, 188, 212, 0.4)"
	},
	containedLabel: {
		color: "white"
	},
	textLabel: {
		color: "rgb(0, 188, 212)"
	},
	textRoot: {
		fontSize: "1em"
	}
};

class SubmitControls extends Component {
	constructor(props) {
		super(props);
		this.state = {  };
		this.el = document.createElement("div");
	}

	componentDidMount () {
		const buttonHolder = document.getElementById("portal-to-submit-buttons");
		buttonHolder.appendChild(this.el);
	}

	render() { 
		return ReactDOM.createPortal( 
			<div className="buttons">
				<Button
					variant="text"
					classes={{
						root: this.props.classes.textRoot,
						label: this.props.classes.textLabel
					}}
					style={{
						marginRight: 12
					}}
					onClick={this.props.cancelAndHome}
				>
					<Translate value="createEditRule.components.submitControls.cancel"/>
				</Button>
				<Button
					variant="contained"
					classes={{
						root: this.props.classes.containedRoot,
						label: this.props.classes.containedLabel,
						focusVisible: this.props.classes.containedFocusVisible
					}}

					disabled={this.props.disabled || false}
					onClick={this.props.handleSaveClick}
				>
					<Translate value="createEditRule.components.submitControls.save"/>
				</Button>
			</div>,
			this.el
		);
	}
}
 
export default withStyles(styledButton)(SubmitControls);