import React, { memo } from "react";
import PropTypes from "prop-types";
import CoordinateParser from "./components/CoordinateParser";
import LandUnitParser from "./components/LandUnitParser";

const propTypes = {
	sourceUnit: PropTypes.string.isRequired,
	unitsOfMeasurement: PropTypes.shape({
		coordinateSystem: PropTypes.string.isRequired,
		landUnitSystem: PropTypes.string.isRequired
	}).isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array,
		PropTypes.shape({
			x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
		}),
		PropTypes.shape({
			lon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
		}),
		PropTypes.shape({
			lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
		})
	]).isRequired,
	decimalPrecision: PropTypes.number
};

const UnitParser = ({ sourceUnit, unitsOfMeasurement, value, decimalPrecision = 5 }) => {
	const { coordinateSystem, landUnitSystem } = unitsOfMeasurement;
	switch (sourceUnit) {
		case "kn":
		case "nm":
			return `${value} ${sourceUnit}`;
		case "°":
			return `${value}${sourceUnit}`;
		case "decimal-degrees":
			return (
				<CoordinateParser
					targetUnit={coordinateSystem}
					value={value}
					decimalPrecision={decimalPrecision} />
			);
		case "kph":
		case "mph":
		case "m":
		case "km":
		case "ft":
		case "mi":
			return (
				<LandUnitParser
					sourceUnit={sourceUnit}
					targetSystem={landUnitSystem}
					value={Number(value)}
				/>
			);
		default:
			return value;
	}
};

UnitParser.propTypes = propTypes;

export default memo(UnitParser);
