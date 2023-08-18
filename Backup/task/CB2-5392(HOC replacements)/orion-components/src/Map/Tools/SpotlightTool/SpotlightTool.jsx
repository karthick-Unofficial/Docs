import { useEffect } from "react";
import PropTypes from "prop-types";
import Draw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import SpotlightMode from "./SpotlightMode";
import styles from "./styles";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./spotlightToolActions.js";

const draw = new Draw({
	modes: Object.assign({ spotlight_mode: SpotlightMode }, Draw.modes),
	userProperties: true,
	displayControlsDefault: false,
	styles
});

const SpotlightTool = () => {
	const dispatch = useDispatch();

	const { updateCurrentFeature } = actionCreators;
	const baseMap = useSelector(state => state.mapState.baseMap);
	const mapTools = useSelector(state => state.mapState.mapTools);
	const feature = mapTools.feature;
	const map = baseMap.mapRef;

	useEffect(() => {
		if (map) {
			map.addControl(draw, "top-left");
			draw.changeMode("spotlight_mode", { feature });
			map.on("draw.spotlightUpdate", e =>
				dispatch(updateCurrentFeature(draw.get(e.spotlight.id)))
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

export default SpotlightTool;
