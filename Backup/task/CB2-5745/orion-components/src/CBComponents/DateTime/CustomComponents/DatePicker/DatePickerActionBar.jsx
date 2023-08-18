import { Button } from "@mui/material";
import React from "react";

import PropTypes from "prop-types";

const propTypes = {
	onAccept: PropTypes.func,
	onClear: PropTypes.func,
	onCancel: PropTypes.func,
	resetDateTime: PropTypes.func,
	submit: PropTypes.func,
	actions: PropTypes.object
};

const defaultProps = {
	resetDateTime: () => {},
	submit: () => {}
};

const DatePickerActionBar = ({
	onAccept,
	onClear,
	onCancel,
	actions,
	resetDateTime,
	submit
}) => {
	const cancel = () => {
		resetDateTime();
		onCancel();
	};
	const ok = () => {
		submit();
		onAccept();
	};
	return (
		<div style={{ display: "flex", padding: "6px" }}>
			<div style={{ flexBasis: "50%" }}>
				{actions[0] === null ? (
					<div></div>
				) : (
					<Button variant="text" onClick={onClear}>
						{actions[0]}
					</Button>
				)}
			</div>
			<div style={{ flexBasis: "50%" }}>
				{actions[1] && (
					<Button variant="text" onClick={cancel}>
						{actions[1]}
					</Button>
				)}
				{actions[2] && (
					<Button variant="text" onClick={ok}>
						{actions[2]}
					</Button>
				)}
			</div>
		</div>
	);
};

DatePickerActionBar.propTypes = propTypes;
DatePickerActionBar.defaultProps = defaultProps;

export default DatePickerActionBar;
