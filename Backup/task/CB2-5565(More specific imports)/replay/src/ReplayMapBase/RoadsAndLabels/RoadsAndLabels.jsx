import { useEffect } from "react";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";

const RoadsAndLabels = () => {
	const mapSettings = useSelector(state => state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings["roadsAndLabels"] : null);
	const baseMap = useSelector(state => state.replayMapState.replayBaseMap);

	const opacity = (mapSettings && !isUndefined(mapSettings.opacity)) ? mapSettings.opacity : 1;
	const visible = mapSettings && mapSettings.visible;

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