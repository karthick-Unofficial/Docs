import React, { Component } from "react";

import {
	MenuItem,
	TextField
} from "material-ui";
import { Dialog as CBDialog, SelectField } from "orion-components/CBComponents";
import { eventService } from "client-app-core";
import ColorTiles from "./ColorTiles";
import TransparencySlider from "./TransparencySlider";
import StrokeProperties from "./StrokeProperties";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

class ProximityDialog extends Component {
	handleCloseProximityDialog = () => {
		this.props.closeDialog("proximityDialog");
	};

	createProximity = () => {
		const proximity = {
			id: + new Date(),
			lineType: this.props.strokeType,
			lineWidth: this.props.strokeThickness,
			name: this.props.name,
			polyFill: this.props.fillColor,
			polyFillOpacity: this.props.transparency/100,
			polyStroke: this.props.strokeColor,
			radius: this.props.radius,
			distanceUnits: this.props.distanceUnits
		};

		eventService.addProximity(this.props.contextId, proximity, (err, response) => {
			if (err) console.log(err);
		});
		this.handleCloseProximityDialog();
	};

	updateProximity = () => {
		const { contextId, proximityId } = this.props;

		const proximity = {
			id: proximityId,
			lineType: this.props.strokeType,
			lineWidth: this.props.strokeThickness,
			name: this.props.name,
			polyFill: this.props.fillColor,
			polyFillOpacity: this.props.transparency/100,
			polyStroke: this.props.strokeColor,
			radius: this.props.radius,
			distanceUnits: this.props.distanceUnits
		};

		eventService.updateProximity(contextId, proximityId, proximity, (err, response) => {
			if (err) console.log(err);
		});

		this.handleCloseProximityDialog();
	};

	render() {
		const {
			dialog,
			isEditing,
			name,
			radius,
			fillColor,
			strokeColor,
			strokeThickness,
			strokeType,
			transparency,
			distanceUnits,
			handleChangeName,
			handleChangeRadius,
			handleChangeDistanceUnits,
			handleChangeLineType,
			handleChangeLineWidth,
			handleChangePolyFill,
			handleChangePolyFillOpacity,
			handleChangePolyStroke,
			dir
		} = this.props;

		const styles = {
			listStyles: {
				backgroundColor: "#41454A",
				marginBottom: ".75rem"
			},
			error: {
				textAlign: "center",
				padding: "10px"
			},
			progress: {
				textAlign: "center",
				padding: "15px 0"
			},
			input: {
				padding: "12px 10px"
			}
		};

		return (
			<CBDialog
				open={dialog === "proximityDialog"}
				confirm={
					isEditing ?
						{
							label: getTranslation("global.profiles.widgets.proximity.proximityDialog.update"),
							action: this.updateProximity,
							disabled: (name === "") || (radius === "" || radius === ".")
						}
						:
						{
							label: getTranslation("global.profiles.widgets.proximity.proximityDialog.create"),
							action: this.createProximity,
							disabled: (name === "") || (radius === "")
						}
				}
				abort={{ label: getTranslation("global.profiles.widgets.proximity.proximityDialog.cancel"), action: this.handleCloseProximityDialog }}
				options={{
					onClose: this.handleCloseProximityDialog,
					maxWidth: "sm"
				}}
				dir={dir}
			>
				<div style={styles}>
					<div>
						<span style={{ color: "white" }}><Translate value="global.profiles.widgets.proximity.proximityDialog.name"/></span>
					</div>
					<TextField
						id="name"
						onChange={handleChangeName}
						value={name}
						autoFocus
						underlineShow={false}
						style={{ borderRadius: 5, padding: "10px 0 0 0" }}
					/>
				</div>
				<div style={styles} className="radius">
					<div>
						<span style={{ color: "white" }}><Translate value="global.profiles.widgets.proximity.proximityDialog.radius"/></span>
					</div>
					<TextField
						id="proximity-radius"
						onChange={handleChangeRadius}
						value={radius}
						underlineShow={false}
						style={{ borderRadius: 5 }}
					/>
					<SelectField
						className="selectDistanceUnit"
						id="distance-unit"
						label={getTranslation("global.profiles.widgets.proximity.proximityDialog.unit")}
						handleChange={handleChangeDistanceUnits}
						value={distanceUnits}
						underlineShow={false}
						style={{ width: "100px" }}
						dir={dir}
					>
						<MenuItem key="km" value="km">
							<Translate value="global.profiles.widgets.proximity.proximityDialog.kilometers"/>
						</MenuItem>
						<MenuItem key="mi" value="mi">
							<Translate value="global.profiles.widgets.proximity.proximityDialog.miles"/>
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

				<TransparencySlider
					transparency={transparency}
					setData={handleChangePolyFillOpacity}
					dir={dir}
				/>

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
			</CBDialog>
		);
	}
}

export default ProximityDialog;