import { useEffect } from "react";
import PropTypes from "prop-types";
import Draw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import FloorPlanMode from "./FloorPlanMode";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { setCoordinates } from "./floorPlanToolActions";

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

const FloorPlanTool = () => {

	const { coordinates } = useSelector(state => state.floorPlan);
	const { mapRef } = useSelector(state => state.mapState.baseMap);
	const coordinatesCopy = coordinates.map(coordinate => {
		return coordinate.slice();
	});
	const map = mapRef;
	const geometry = {
		type: "Polygon",
		coordinates: [coordinatesCopy]

	};
	const dispatch = useDispatch();

	useEffect(() => {
		if (map) {
			map.addControl(draw, "top-left");
			draw.changeMode("floor_plan_mode", { feature: { geometry } });
			map.on("draw.floorPlanUpdate", e => {
				const coordinatesCopy = e.floorPlan.coordinates[0].map(coordinate => {
					return coordinate.slice();
				});
				return dispatch(setCoordinates(coordinatesCopy));
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
