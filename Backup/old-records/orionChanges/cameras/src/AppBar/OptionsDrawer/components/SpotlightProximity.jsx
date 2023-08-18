import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import {
	FormControl,
	FormHelperText,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Typography
} from "@material-ui/core";
import { Clear, Done } from "@material-ui/icons";
import convert from "convert-units";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	globalState: PropTypes.object.isRequired,
	updateGlobalSettings: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const SpotlightProximity = ({ globalState, updateGlobalSettings, dir }) => {
	const { unitsOfMeasurement, spotlightProximity } = globalState;
	const { landUnitSystem } = unitsOfMeasurement;
	const outputUnit = landUnitSystem === "metric" ? "km" : "mi";
	const initialProximity = spotlightProximity
		? parseFloat(
			convert(spotlightProximity.value)
				.from(spotlightProximity.unit)
				.to(outputUnit)
				.toFixed(3)
		  )
		: 0.3;
	const [proximity, setProximity] = useState(initialProximity);
	const [error, setError] = useState(false);
	const [modified, setModified] = useState(false);
	const handleUpdate = e => {
		const { value } = e.target;
		setProximity(e.target.value);
		const decimals = value.split(".")[1];
		if (value.toString() !== spotlightProximity.value.toString()) {
			setModified(true);
		} else {
			setModified(false);
		}
		if (isNaN(value) || Number(value) === 0) {
			setError("appBar.optionDrawer.spotlightProx.errorText.invalidProx");
		} else if (decimals && decimals.length > 3) {
			setError("appBar.optionDrawer.spotlightProx.errorText.limitedValue");
		} else {
			setError(false);
		}
	}; 
	const handleClear = () => {
		setProximity(initialProximity);
		setError(false);
		setModified(false);
	};
	const handleSave = () => {
		updateGlobalSettings({
			...globalState,
			spotlightProximity: { value: Number(proximity), unit: outputUnit }
		});
		setModified(false);
	};
	return (
		<section>
			<Typography variant="subtitle1"><Translate value="appBar.optionDrawer.spotlightProx.title"/></Typography>
			<div style={{ display: "flex", alignItems: "flex-start" }}>
				<FormControl error={!!error}>
					<InputLabel style={dir && dir == "rtl" ? { left: "unset", transformOrigin: "top right" } : {}}><Translate value="appBar.optionDrawer.spotlightProx.defaultProx"/></InputLabel>
					<Input
						id="spotlight-proximity"
						value={proximity}
						onChange={handleUpdate}
						endAdornment={<InputAdornment>{outputUnit == "km" ? <Translate value="appBar.optionDrawer.spotlightProx.km"/> : <Translate value="appBar.optionDrawer.spotlightProx.mi"/>}</InputAdornment>}
					/>
					{!!error && <FormHelperText><Translate value={error}/></FormHelperText>}
				</FormControl>
				<IconButton
					onClick={handleSave}
					color="primary"
					disabled={!proximity || !modified || !!error}
				>
					<Done />
				</IconButton>
				<IconButton onClick={handleClear} disabled={!modified}>
					<Clear />
				</IconButton>
			</div>
		</section>
	);
};

SpotlightProximity.propTypes = propTypes;

export default memo(SpotlightProximity);
