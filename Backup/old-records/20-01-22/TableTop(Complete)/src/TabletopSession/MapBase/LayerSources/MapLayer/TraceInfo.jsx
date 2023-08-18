import React, { Fragment, useEffect, useState } from "react";
import { Popup } from "react-mapbox-gl";
import PropTypes from "prop-types";

const propTypes = {
	map: PropTypes.object.isRequired,
	layerId: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired
};

const TraceInfo = ({ map, layerId, type }) => {
	const [ popupFeature, setPopupFeature ] = useState(null);
	const [ hoverPoint, setHoverPoint ] = useState(null);

	useEffect(() => {
		const handleHover = e => {
			const features = map.queryRenderedFeatures(e.point, { layers: [ layerId ] });
			if (features.length > 0 && popupFeature !== features[0]) {
				setPopupFeature(features[0]);
				if (type === "line") {
					setHoverPoint([e.lngLat.lng, e.lngLat.lat]);
				}
				map.getCanvas().style.cursor = "pointer";
			}
		};

		const handleHoverExit = () => {
			setPopupFeature(null);
			if (type === "line") {
				setHoverPoint(null);
			}
			map.getCanvas().style.cursor = "";
		};
	
		map.on("mouseenter", layerId, handleHover);
		map.on("mouseleave", layerId, handleHoverExit);

		return () => {
			map.off("mouseenter", layerId, handleHover);
			map.off("mouseleave", layerId, handleHoverExit);
		};
	}, []);

	return (
		<Fragment>
			{popupFeature && (type !== "line" || hoverPoint) &&
				<Popup
					className="mapPopup"
					coordinates={type === "line" ? hoverPoint : popupFeature.geometry.coordinates}
					offset={12}
				>
					<div className="b1-white">
						<p>{popupFeature.properties.desc}</p>
					</div>
				</Popup>
			}
		</Fragment>
	);
};

TraceInfo.propTypes = propTypes;

export default TraceInfo;
