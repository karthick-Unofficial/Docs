import kinks from "@turf/kinks";
import { polygon, lineString } from "@turf/helpers";
import { lengthToDegrees } from "@turf/helpers";
import square from "@turf/square";
import bboxPolygon from "@turf/bbox-polygon";
import { toast } from "react-toastify";
import { getTranslation } from "orion-components/i18n";

/**
 *
 * @param {Object} geometry - { type: String, coordinates: Array}
 */
export const validateShape = geometry => {
	const { type, coordinates } = geometry;
	let feature = null;
	if (type !== "Polygon" && type !== "LineString") {
		return true;
	} else if (type === "Polygon") {
		feature = polygon(coordinates);
	} else if (type === "LineString") {
		feature = lineString(coordinates);
	}
	if (feature) {
		const { features } = kinks(feature);
		if (features.length) {
			toast(
				getTranslation("global.map.helper.toast"),
				{ type: "error" }
			);
			return false;
		}
		return true;
	}
};

export const getSpotlight = ({
	center,
	spotlightProximity = { value: 0.3, unit: "mi" }
}) => {
	if (!spotlightProximity) spotlightProximity = { value: 0.3, unit: "mi" };
	
	const [x, y] = center.geometry.coordinates;
	const { value, unit } = spotlightProximity;
	const offset = lengthToDegrees(value, unit === "km" ? "kilometers" : "miles");
	const defaultSpotlight = bboxPolygon(
		square([x - offset, y - offset, x + offset, y + offset])
	);

	return defaultSpotlight;
};
