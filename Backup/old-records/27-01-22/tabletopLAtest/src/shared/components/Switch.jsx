import React from "react";
import PropTypes from "prop-types";
import { Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool
};

const defaultProps = {
	disabled: false
};

const useSwitchStyles = makeStyles(() => ({
	checked: {
		color: "#4DB5F4"
	},
	track:{
		backgroundColor: "#3B7491"
	}
}));

const StyledSwitch = ( { checked, onChange, name, disabled } ) => {
	const switchclasses = useSwitchStyles();

	return (
		<Switch 
			checked={checked} 
			onChange={onChange} 
			name={name}
			color="primary"
			classes={{
				checked: switchclasses.checked,
				track: switchclasses.track
			}}
			disabled={disabled}
		/>
	);
};

StyledSwitch.propTypes = propTypes;
StyledSwitch.defaultProps = defaultProps;
export default StyledSwitch;