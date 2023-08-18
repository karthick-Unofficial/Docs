import { memo, useEffect } from "react";
import PropTypes from "prop-types";
import Draw from "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw";

const propTypes = {
	map: PropTypes.object.isRequired,
	feature: PropTypes.object,
	mode: PropTypes.string.isRequired,
	updateCurrentFeature: PropTypes.func.isRequired
};

const defaultProps = {
	entity: null
};

const draw = new Draw();

const DrawingTool = ({ feature, map, mode, updateCurrentFeature }) => {
	const handleDraw = () => {
		if (feature) {
			const { id, properties, geometry } = feature;
			draw.add({ id, type: "Feature", properties, geometry });

			const modeObject = mode === "simple_select" ? { featureIds: [ id ] } : { featureId: id };
			draw.changeMode(mode, modeObject);
		} else {
			draw.changeMode(mode);
		}
	};
	useEffect(() => {
		if (map) {
			map.addControl(draw, "top-left");
			handleDraw();
			map.on("draw.update", () => {
				const { features } = draw.getAll();
				if (features.length) {
					const feature = features[0];
					updateCurrentFeature(feature);
				}
			});
			map.on("draw.create", () => {
				const { features } = draw.getAll();
				if (features.length) {
					const feature = features[0];
					updateCurrentFeature(feature);
				}
			});
			map.on("draw.modechange", e => {
				const { features } = draw.getAll();
				/**
				 * Handle closing a polygon with insufficient points
				 * Re-initializes drawing mode
				 */
				if (!features.length) {
					handleDraw();
				}
			});
			// If a feature is deleted, allow user to start over
			map.on("draw.delete", e => {
				setTimeout(() => {
					handleDraw();
				}, 200);
			});
			return () => {
				draw.deleteAll();
				map.removeControl(draw);
			};
		}
	}, [map]);
	return null;
};

DrawingTool.propTypes = propTypes;
DrawingTool.defaultProps = defaultProps;

export default memo(DrawingTool);
