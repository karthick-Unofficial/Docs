import React from "react";

import { MenuItem, TextField } from "@mui/material";
import { Dialog as CBDialog, SelectField } from "orion-components/CBComponents";
import { eventService } from "client-app-core";
import ColorTiles from "./ColorTiles";
import TransparencySlider from "./TransparencySlider";
import StrokeProperties from "./StrokeProperties";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";

const styles = {
	input: {
		fontSize: 14,
		height: "unset!important",
		color: "#fff"
	}
};

const propTypes = {
	closeDialog: PropTypes.func,
	strokeType: PropTypes.string,
	strokeThickness: PropTypes.number,
	name: PropTypes.string,
	fillColor: PropTypes.string,
	transparency: PropTypes.number,
	strokeColor: PropTypes.string,
	radius: PropTypes.number,
	distanceUnits: PropTypes.string,
	contextId: PropTypes.string,
	proximityId: PropTypes.string,
	dialog: PropTypes.string,
	isEditing: PropTypes.bool,
	handleChangeName: PropTypes.func,
	handleChangeRadius: PropTypes.func,
	handleChangeDistanceUnits: PropTypes.func,
	handleChangeLineType: PropTypes.func,
	handleChangeLineWidth: PropTypes.func,
	handleChangePolyFill: PropTypes.func,
	handleChangePolyFillOpacity: PropTypes.func,
	handleChangePolyStroke: PropTypes.func,
	dir: PropTypes.string,
	classes: PropTypes.object
};

const ProximityDialog = ({
	closeDialog,
	strokeType,
	strokeThickness,
	name,
	fillColor,
	transparency,
	strokeColor,
	radius,
	distanceUnits,
	contextId,
	proximityId,
	dialog,
	isEditing,
	handleChangeName,
	handleChangeRadius,
	handleChangeDistanceUnits,
	handleChangeLineType,
	handleChangeLineWidth,
	handleChangePolyFill,
	handleChangePolyFillOpacity,
	handleChangePolyStroke,
	dir,
	classes
}) => {
	const dispatch = useDispatch();

	const handleCloseProximityDialog = () => {
		dispatch(closeDialog("proximityDialog"));
	};

	const createProximity = () => {
		const proximity = {
			id: +new Date(),
			lineType: strokeType,
			lineWidth: strokeThickness,
			name,
			polyFill: fillColor,
			polyFillOpacity: transparency / 100,
			polyStroke: strokeColor,
			radius,
			distanceUnits
		};

		eventService.addProximity(contextId, proximity, (err, response) => {
			if (err) console.log(err, response);
		});
		handleCloseProximityDialog();
	};

	const updateProximity = () => {
		const proximity = {
			id: proximityId,
			lineType: strokeType,
			lineWidth: strokeThickness,
			name,
			polyFill: fillColor,
			polyFillOpacity: transparency / 100,
			polyStroke: strokeColor,
			radius,
			distanceUnits
		};

		eventService.updateProximity(contextId, proximityId, proximity, (err, response) => {
			if (err) console.log(err, response);
		});

		handleCloseProximityDialog();
	};

	const styles = {
		name: {
			borderRadius: 5,
			width: "40%",
			...(dir === "ltr" && { marginRight: "10%" }),
			...(dir === "rtl" && { marginLeft: "10%" })
		},
		inputLabel: {
			fontSize: 14,
			...(dir === "rtl" && { width: "100%", transformOrigin: "top right", textAlign: "right" }),
			...(dir === "ltr" && { width: "90%", transformOrigin: "top left", textAlign: "left" }),
		}
	};

	return (
		<CBDialog
			open={dialog === "proximityDialog"}
			confirm={
				isEditing
					? {
						label: getTranslation("global.profiles.widgets.proximity.proximityDialog.update"),
						action: updateProximity,
						disabled: name === "" || radius === "" || radius === "."
					}
					: {
						label: getTranslation("global.profiles.widgets.proximity.proximityDialog.create"),
						action: createProximity,
						disabled: name === "" || radius === ""
					}
			}
			abort={{
				label: getTranslation("global.profiles.widgets.proximity.proximityDialog.cancel"),
				action: handleCloseProximityDialog
			}}
			options={{
				onClose: handleCloseProximityDialog,
				maxWidth: "sm"
			}}
			dir={dir}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
				<TextField
					id="name"
					onChange={handleChangeName}
					value={name}
					variant="standard"
					autoFocus
					label={getTranslation("global.profiles.widgets.proximity.proximityDialog.name")}
					style={styles.name}
					InputProps={{
						classes: { input: classes.input },
						style: { lineHeight: "unset" }
					}}
					InputLabelProps={{
						style: styles.inputLabel
					}}
				/>
				<TextField
					id="proximity-radius"
					onChange={handleChangeRadius}
					value={radius}
					variant="standard"
					label={getTranslation("global.profiles.widgets.proximity.proximityDialog.radius")}
					style={{ borderRadius: 5, width: "20%" }}
					InputProps={{
						classes: { input: classes.input },
						style: { lineHeight: "unset" }
					}}
					InputLabelProps={{
						style: styles.inputLabel
					}}
				/>
				<SelectField
					className="selectDistanceUnit"
					id="distance-unit"
					label={getTranslation("global.profiles.widgets.proximity.proximityDialog.unit")}
					handleChange={handleChangeDistanceUnits}
					value={distanceUnits}
					formControlProps={{
						style: { width: "20%", margin: 0 }
					}}
					inputProps={{
						style: { fontSize: 14 }
					}}
					dir={dir}
				>
					<MenuItem key="ft" value="ft">
						<Translate value="global.profiles.widgets.proximity.proximityDialog.feet" />
					</MenuItem>
					<MenuItem key="m" value="m">
						<Translate value="global.profiles.widgets.proximity.proximityDialog.meters" />
					</MenuItem>
					<MenuItem key="km" value="km">
						<Translate value="global.profiles.widgets.proximity.proximityDialog.kilometers" />
					</MenuItem>
					<MenuItem key="mi" value="mi">
						<Translate value="global.profiles.widgets.proximity.proximityDialog.miles" />
					</MenuItem>
				</SelectField>
			</div>
			<div style={{ padding: "12px 20px" }}>
				<ColorTiles
					selectedColor={fillColor}
					title={getTranslation("global.profiles.widgets.proximity.proximityDialog.fillColor")}
					setData={handleChangePolyFill}
				/>
			</div>

			<TransparencySlider transparency={transparency} setData={handleChangePolyFillOpacity} dir={dir} />

			<div style={{ padding: "0px 20px" }}>
				<ColorTiles
					selectedColor={strokeColor}
					title={getTranslation("global.profiles.widgets.proximity.proximityDialog.strokeColor")}
					setData={handleChangePolyStroke}
				/>

				<StrokeProperties
					thickness={strokeThickness}
					type={strokeType}
					titleNoun={getTranslation("global.profiles.widgets.proximity.proximityDialog.stroke")}
					setThickness={handleChangeLineWidth}
					setType={handleChangeLineType}
					dir={dir}
				/>
			</div>
		</CBDialog >
	);
};

ProximityDialog.propTypes = propTypes;

export default withStyles(styles)(ProximityDialog);
