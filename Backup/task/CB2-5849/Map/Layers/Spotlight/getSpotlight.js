import { lengthToDegrees } from "@turf/helpers";
import square from "@turf/square";
import bboxPolygon from "@turf/bbox-polygon";

const getSpotlight = ({ camera, spotlightProximity }) => {
	const { geometry } = camera.entityData;
	const [x, y] = geometry.coordinates;
	const { value, unit } = spotlightProximity;
	const offset = lengthToDegrees(value, unit === "km" ? "kilometers" : "miles");
	const defaultSpotlight = bboxPolygon(square([x - offset, y - offset, x + offset, y + offset]));

	return defaultSpotlight;
};

export default getSpotlight;
