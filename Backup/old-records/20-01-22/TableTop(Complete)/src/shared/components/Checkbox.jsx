import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const propTypes = {
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool
};

const defaultProps = {
	disabled: false
};

const useCheckBoxStyles = makeStyles(() => ({
	root: {
		color: "#828283",
		"&$checked": {
			color: "#4eb5f3"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
}));

const StyledCheckbox = ( { checked, onChange, name, disabled } ) => {
	const checkBoxclasses = useCheckBoxStyles();

	return (
		<Checkbox 
			checked={checked} 
			onChange={onChange} 
			name={name} 
			color="default"
			disableTouchRipple={true}
			classes={{
				root: checkBoxclasses.root,
				checked: checkBoxclasses.checked,
				disabled: checkBoxclasses.disabled
			}}
			disabled={disabled}
		/>
	);
};

StyledCheckbox.propTypes = propTypes;
StyledCheckbox.defaultProps = defaultProps;
export default StyledCheckbox;