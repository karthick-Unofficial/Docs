import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";


const RoadsAndLabels = () => {

	const { mapSettings } = useSelector(state => state.appState.persisted);
	const { baseMap } = useSelector(state => state.mapState);

	let opacity;
	let visible;
	if (mapSettings && mapSettings["roadsAndLabels"]) {
		opacity = mapSettings["roadsAndLabels"].opacity;
		visible = mapSettings["roadsAndLabels"].visible;
	}
	else{
		opacity = 1;
		visible= false;
	}

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

export default RoadsAndLabels;
