import { useEffect } from "react";
import PropTypes from "prop-types";
import Draw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";
import SpotlightMode from "./SpotlightMode";
import styles from "./styles";

const propTypes = {
	feature: PropTypes.object,
	map: PropTypes.object.isRequired,
	updateCurrentFeature: PropTypes.func.isRequired
};

const defaultProps = {
	feature: null
};

const draw = new Draw({
	modes: Object.assign({ spotlight_mode: SpotlightMode }, Draw.modes),
	userProperties: true,
	displayControlsDefault: false,
	styles
});

const SpotlightTool = ({ feature, map, updateCurrentFeature }) => {
	useEffect(() => {
		if (map) {
			map.addControl(draw, "top-left");
			draw.changeMode("spotlight_mode", { feature });
			map.on("draw.spotlightUpdate", e =>
				updateCurrentFeature(draw.get(e.spotlight.id))
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

SpotlightTool.propTypes = propTypes;
SpotlightTool.defaultProps = defaultProps;

export default SpotlightTool;
