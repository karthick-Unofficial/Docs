import { memo } from "react";
import PropTypes from "prop-types";
import convert from "convert-units";

const parse = (unit) => {
	let output = unit;
	switch (unit) {
		case "kph":
			output = "km/h";
			break;
		case "km/h":
			output = "kph";
			break;
		case "mph":
			output = "m/h";
			break;
		case "m/h":
			output = "mph";
			break;
		default:
			break;
	}
	return output;
};
const excludeUnits = (system) => {
	const exclusion = system === "imperial" ? "metric" : "imperial";
	const lengths = convert()
		.list("length")
		.filter((unit) => unit.system === exclusion)
		.map((unit) => unit.abbr);
	const speeds = convert()
		.list("speed")
		.filter((unit) => unit.system === exclusion)
		.map((unit) => unit.abbr);
	return [...speeds, ...lengths, "knot", "m/s", "ft/s", "yd", "ft-us", "cm", "mm"];
};

const propTypes = {
	sourceUnit: PropTypes.oneOf(["kph", "mph", "m", "km", "ft", "mi"]),
	targetSystem: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired
};

const LandUnitParser = ({ sourceUnit, targetSystem, value }) => {
	const toBest = (source, target, value) => {
		const newUnit = convert(value).from(source).to(target);
		return convert(newUnit)
			.from(target)
			.toBest({ exclude: excludeUnits(targetSystem) });
	};
	let output = convert(value)
		.from(parse(sourceUnit))
		.toBest({ exclude: excludeUnits(targetSystem) });
	switch (targetSystem) {
		case "imperial":
			switch (sourceUnit) {
				case "kph":
					output = {
						val: convert(value).from("km/h").to("m/h"),
						unit: "m/h"
					};
					break;
				case "m":
				case "km":
					output = toBest(sourceUnit, "ft", value);
					break;
				default:
					break;
			}
			break;
		case "metric":
			switch (sourceUnit) {
				case "mph":
					output = {
						val: convert(value).from("m/h").to("km/h"),
						unit: "km/h"
					};
					break;
				case "mi":
				case "ft":
					output = toBest(sourceUnit, "m", value);
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
	if (output) {
		const { val, unit } = output;
		return `${Number.isInteger(val) ? val : val.toFixed(1)} ${parse(unit)}`;
	} else {
		return value;
	}
};

LandUnitParser.propTypes = propTypes;

export default memo(LandUnitParser);
