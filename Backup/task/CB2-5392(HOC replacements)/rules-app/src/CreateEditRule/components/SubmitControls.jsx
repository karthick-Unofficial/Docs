import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// material-ui
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Translate } from "orion-components/i18n";

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

const SubmitControls = ({ classes, cancelAndHome, disabled, handleSaveClick, dir }) => {
	const el = useRef(document.createElement("div"));

	useEffect(() => {
		const buttonHolder = document.getElementById("portal-to-submit-buttons");
		buttonHolder.appendChild(el.current);
	}, []);

	return ReactDOM.createPortal(
		<div className="buttons">
			<Button
				variant="text"
				classes={{
					root: classes.textRoot,
					label: classes.textLabel
				}}
				style={dir == "rtl" ? {
					marginLeft: 12
				} : {
					marginRight: 12
				}}
				onClick={cancelAndHome}
			>
				<Translate value="createEditRule.components.submitControls.cancel" />
			</Button>
			<Button
				variant="contained"
				classes={{
					root: classes.containedRoot,
					label: classes.containedLabel,
					focusVisible: classes.containedFocusVisible
				}}

				disabled={disabled || false}
				onClick={handleSaveClick}
			>
				<Translate value="createEditRule.components.submitControls.save" />
			</Button>
		</div>,
		el.current
	);
};

export default withStyles(styledButton)(SubmitControls);