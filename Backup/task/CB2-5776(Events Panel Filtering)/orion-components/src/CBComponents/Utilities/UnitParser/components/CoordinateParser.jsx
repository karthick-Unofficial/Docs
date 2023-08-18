import { memo } from "react";
import PropTypes from "prop-types";
import geo from "mt-geo";

const propTypes = {
	targetUnit: PropTypes.string.isRequired,
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
	decimalPrecision: PropTypes.number.isRequired
};

const CoordinateParser = ({ targetUnit, value, decimalPrecision }) => {
	const getKeys = (object) => {
		if (Array.isArray(object)) {
			return { lngKey: 0, latKey: 0 };
		} else if (Object.keys(value).includes("x")) {
			return { lngKey: "x", latKey: "y" };
		} else if (Object.keys(value).includes("lng")) {
			return { lngKey: "lng", latKey: "lat" };
		} else if (Object.keys(value).includes("lon")) {
			return { lngKey: "lon", latKey: "lat" };
		}
	};
	let output = value;
	if (targetUnit === "decimal-degrees") {
		switch (typeof value) {
			case "string":
				output = parseFloat(value).toFixed(decimalPrecision);
				break;
			case "number":
				output = value.toFixed(decimalPrecision);
				break;
			case "object":
				{
					const { lngKey, latKey } = getKeys(value);
					output = `${parseFloat(value[latKey]).toFixed(decimalPrecision)}9\xB0, ${parseFloat(
						value[lngKey]
					).toFixed(decimalPrecision)}9\xB0`;
				}
				break;
			default:
				break;
		}
	} else {
		const format = targetUnit === "degrees-min-sec" ? "dms" : "dm";
		switch (typeof value) {
			case "string":
				output = geo.toDMS(parseFloat(value));
				break;
			case "number":
				output = geo.toDMS(value);
				break;
			case "object":
				{
					const { lngKey, latKey } = getKeys(value);
					output = `${geo.toLat(value[latKey], format)}, ${geo.toLon(value[lngKey], format)}`;
				}
				break;
			default:
				break;
		}
	}
	return output;
};

CoordinateParser.propTypes = propTypes;

export default memo(CoordinateParser);
