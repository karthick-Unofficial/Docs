import React, { Fragment } from "react";
import { SelectField } from "orion-components/CBComponents";
import { MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n";
import { withStyles } from "@mui/styles";
import { useState, useEffect } from "react";

const propTypes = {
	thickness: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	titleNoun: PropTypes.string.isRequired,
	setThickness: PropTypes.func.isRequired,
	setType: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	thickness: 3,
	type: "solid",
	titleNoun: "Stroke",
	setThickness: () => {},
	setType: () => {},
	dir: "ltr"
};

const styles = {
	selected: {
		backgroundColor: "rgba(255, 255, 255, 0.16)!important"
	}
};

const StrokeProperties = ({
	thickness,
	type,
	titleNoun,
	setThickness,
	setType,
	dir,
	classes
}) => {
	const [thicknessTitle, setThicknessTitle] = useState("");
	const [typeTitle, setTypeTitle] = useState("");

	useEffect(() => {
		switch (titleNoun) {
			case "Stroke":
				setThicknessTitle(
					getTranslation(
						"global.sharedComponents.shapeEdit.strokeProps.strokeThickness"
					)
				);
				setTypeTitle(
					getTranslation(
						"global.sharedComponents.shapeEdit.strokeProps.strokeType"
					)
				);
				break;
			case "Line":
				setThicknessTitle(
					getTranslation(
						"global.sharedComponents.shapeEdit.strokeProps.lineThickness"
					)
				);
				setTypeTitle(
					getTranslation(
						"global.sharedComponents.shapeEdit.strokeProps.lineType"
					)
				);
				break;
			default:
				setThicknessTitle(`${titleNoun} Thickness`);
				setTypeTitle(`${titleNoun} Type`);
		}
	}, [titleNoun]);

	const handleThicknessChange = (e) => {
		const value = e.target.value;

		setThickness(value);
	};

	const handleTypeChange = (e) => {
		const value = e.target.value;

		setType(value);
	};

	const thicknessOptions = [1, 2, 3, 4, 5, 6];
	const strokeTypeOptions = ["Solid", "Dashed", "Dotted"];

	return (
		<Fragment>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div style={{ width: "45%" }}>
					<SelectField
						id={`${titleNoun}-thickness`}
						label={thicknessTitle}
						handleChange={handleThicknessChange}
						value={thickness}
						inputProps={{ style: { fontSize: 14 } }}
						dir={dir}
					>
						{thicknessOptions.map((thickVal) => (
							<MenuItem
								key={thickVal}
								value={thickVal}
								style={{ fontSize: 14 }}
								classes={{ selected: classes.selected }}
							>
								<Translate
									value="global.sharedComponents.shapeEdit.strokeProps.point"
									count={thickVal}
								/>
							</MenuItem>
						))}
					</SelectField>
				</div>
				<div style={{ width: "45%" }}>
					<SelectField
						id={`${titleNoun}-type`}
						label={typeTitle}
						handleChange={handleTypeChange}
						value={type}
						inputProps={{ style: { fontSize: 14 } }}
						dir={dir}
					>
						{strokeTypeOptions.map((strokeVal) => (
							<MenuItem
								key={strokeVal}
								value={strokeVal}
								style={{ fontSize: 14 }}
								classes={{ selected: classes.selected }}
							>
								<Translate
									value={`global.sharedComponents.shapeEdit.strokeProps.${strokeVal}`}
								/>
							</MenuItem>
						))}
					</SelectField>
				</div>
			</div>
		</Fragment>
	);
};

StrokeProperties.propTypes = propTypes;
StrokeProperties.defaultProps = defaultProps;

export default withStyles(styles)(StrokeProperties);
