import { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const propTypes = {
	feature: PropTypes.object.isRequired,
	map: PropTypes.object.isRequired
};

const Spotlight = ({ feature }) => {
	const mapRef = useSelector((state) => state.mapState.baseMap.mapRef);
	const map = mapRef;

	const clearSource = () => {
		map.removeLayer(`ac2-${feature.id}-spotlight`);
		map.removeSource(`ac2-${feature.id}-spotlight-source`);
	};
	const addSource = (feature) => {
		map.addSource(`ac2-${feature.id}-spotlight-source`, {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [feature]
			}
		});
		map.addLayer({
			id: `ac2-${feature.id}-spotlight`,
			type: "line",
			source: `ac2-${feature.id}-spotlight-source`,
			paint: {
				"line-color": [
					"case",
					["has", "strokeColor"],
					["get", "strokeColor"],
					"#35b7f3"
				],
				"line-width": 10
			}
		});
	};
	useEffect(() => {
		addSource(feature);
		return () => {
			clearSource();
		};
	}, [feature]);
	return null;
};

Spotlight.propTypes = propTypes;

export default memo(Spotlight);
