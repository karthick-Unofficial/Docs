import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import { Clear, Done } from "@mui/icons-material";
import convert from "convert-units";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { TextField } from "orion-components/CBComponents";
import { makeStyles } from "@mui/styles";

const propTypes = {
	globalState: PropTypes.object.isRequired,
	updateGlobalSettings: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const useStyles = makeStyles({
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
});

const SpotlightProximity = ({ globalState, updateGlobalSettings, dir }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { unitsOfMeasurement, spotlightProximity } = globalState;
	const { landUnitSystem } = unitsOfMeasurement;
	const outputUnit = landUnitSystem === "metric" ? "km" : "mi";
	const initialProximity = spotlightProximity
		? parseFloat(convert(spotlightProximity.value).from(spotlightProximity.unit).to(outputUnit).toFixed(3))
		: 0.3;
	const [proximity, setProximity] = useState(initialProximity);
	const [error, setError] = useState(false);
	const [modified, setModified] = useState(false);
	const handleUpdate = (e) => {
		const { value } = e.target;
		setProximity(e.target.value);
		const decimals = value.split(".")[1];
		if (value.toString() !== spotlightProximity.value.toString()) {
			setModified(true);
		} else {
			setModified(false);
		}
		if (isNaN(value) || Number(value) === 0) {
			setError("global.appBar.optionsDrawer.spotlightProx.errorText.invalidProx");
		} else if (decimals && decimals.length > 3) {
			setError("global.appBar.optionsDrawer.spotlightProx.errorText.limitedValue");
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
		dispatch(
			updateGlobalSettings({
				...globalState,
				spotlightProximity: {
					value: Number(proximity),
					unit: outputUnit
				}
			})
		);
		setModified(false);
	};
	return (
		<section>
			<Typography variant="subtitle1">
				<Translate value="global.appBar.optionsDrawer.spotlightProx.title" />
			</Typography>
			<div style={{ display: "flex", alignItems: "flex-start" }}>
				<TextField
					label={getTranslation("global.appBar.optionsDrawer.spotlightProx.defaultProx")}
					value={proximity}
					handleChange={handleUpdate}
					dir={dir}
					error={!!error}
					disableFocusError={true}
					inputLabelStyle={{ fontSize: 14 }}
					endAdornment={
						outputUnit == "km"
							? getTranslation("global.appBar.optionsDrawer.spotlightProx.km")
							: getTranslation("global.appBar.optionsDrawer.spotlightProx.mi")
					}
					endAdornmentStyles={{}}
					formControlStyles={{ margin: 0 }}
					helperText={!!error && getTranslation(error)}
					inputStyles={{ marginRight: 0 }}
					autoFocus={true}
				/>
				<IconButton
					onClick={handleSave}
					classes={{ disabled: classes.disabled }}
					color="primary"
					disabled={!proximity || !modified || !!error}
					sx={{ width: "48px", height: "48px", padding: "12px" }}
				>
					<Done />
				</IconButton>
				<IconButton
					onClick={handleClear}
					classes={{ disabled: classes.disabled }}
					disabled={!modified}
					sx={{ width: "48px", height: "48px", padding: "12px" }}
				>
					<Clear />
				</IconButton>
			</div>
		</section>
	);
};

SpotlightProximity.propTypes = propTypes;

export default memo(SpotlightProximity);
