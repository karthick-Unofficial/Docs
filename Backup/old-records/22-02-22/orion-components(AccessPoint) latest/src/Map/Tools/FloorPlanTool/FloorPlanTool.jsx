import { useEffect } from "react";
import PropTypes from "prop-types";
import Draw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import FloorPlanMode from "./FloorPlanMode";
import styles from "./styles";

const draw = new Draw({
	modes: Object.assign({ floor_plan_mode: FloorPlanMode }, Draw.modes),
	userProperties: true,
	styles
});

const propTypes = {
	map: PropTypes.object.isRequired,
	geometry: PropTypes.shape({
		type: PropTypes.string.isRequired,
		coordinates: PropTypes.array.isRequired
	}).isRequired,
	setCoordinates: PropTypes.func.isRequired
};

const FloorPlanTool = ({ map, geometry, setCoordinates }) => {
	useEffect(() => {
		if (map) {
			map.addControl(draw, "top-left");
			draw.changeMode("floor_plan_mode", { feature: { geometry } });
			map.on("draw.floorPlanUpdate", e => {
				const coordinatesCopy = e.floorPlan.coordinates[0].map(coordinate => {
					return coordinate.slice();
				});
				return setCoordinates(coordinatesCopy);
			}
			);
			return () => {
				draw.trash();
				draw.deleteAll();
				draw.changeMode("simple_select");
				map.removeControl(draw);
			};
		}
	}, [map]);
	return null;
};

FloorPlanTool.propTypes = propTypes;

export default FloorPlanTool;
