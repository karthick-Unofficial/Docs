import { useEffect } from "react";
import PropTypes from "prop-types";

const propTypes = {
	opacity: PropTypes.number,
	visible: PropTypes.bool,
	baseMap: PropTypes.object.isRequired
};

const defaultProps = {
	opacity: 1,
	visible: false
};

const RoadsAndLabels = ({ opacity, visible, baseMap }) => {
	useEffect(() => {
		const { mapRef } = baseMap;
		const setRoadsAndLabels = () => {
			const roadsAndLabels = mapRef.getStyle().layers.filter(layer => {
				return (
					layer["source-layer"] &&
					(layer["source-layer"].includes("road") ||
						layer["source-layer"].includes("label"))
				);
			});
			roadsAndLabels.forEach(layer => {
				if (visible) {
					if (layer.type === "line") {
						return mapRef
							.setLayoutProperty(layer.id, "visibility", "visible")
							.setPaintProperty(layer.id, "line-opacity", opacity);
					} else if (layer.type === "symbol") {
						return mapRef
							.setLayoutProperty(layer.id, "visibility", "visible")
							.setPaintProperty(layer.id, "text-opacity", opacity)
							.setPaintProperty(layer.id, "icon-opacity", opacity);
					}
				} else {
					return mapRef.setLayoutProperty(layer.id, "visibility", "none");
				}
			});
		};
		if (mapRef) {
			setRoadsAndLabels();
		}
	}, [baseMap, opacity, visible]);
	return null;
};

RoadsAndLabels.propTypes = propTypes;
RoadsAndLabels.defaultProps = defaultProps;

export default RoadsAndLabels;
