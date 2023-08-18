import React, { Fragment, useEffect, useState } from "react";
import { Popup } from "react-mapbox-gl";
import PropTypes from "prop-types";
import * as utilities from "../../../../shared/utility/utilities";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object.isRequired,
	simTimePrecision: PropTypes.number
};

const LocationHistoryInfo = ({ map, simTimePrecision }) => {
	const [popupFeature, setPopupFeature] = useState(null);

	useEffect(() => {
		const handleHover = e => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ["track-history-points"]
			});
			if (features.length > 0 && popupFeature !== features[0]) {
				setPopupFeature(features[0]);
				map.getCanvas().style.cursor = "pointer";
			}
		};

		const handleHoverExit = () => {
			setPopupFeature(null);
			map.getCanvas().style.cursor = "";
		};
	
		map.on("mouseenter", "track-history-points", handleHover);
		map.on("mouseleave", "track-history-points", handleHoverExit);

		return () => {
			map.off("mouseenter", "track-history-points", handleHover);
			map.off("mouseleave", "track-history-points", handleHoverExit);
		};
	}, []);

	return (
		<Fragment>
			{popupFeature && 
				<Popup
					className="mapPopup"
					coordinates={popupFeature.geometry.coordinates}
					offset={12}
				>
					<div className="b1-white">
						{/* Name */}
						<p>{popupFeature.properties.agentName}</p>

						{/* SimTime */}
						<p><Translate value="tableopSession.mapBase.layerSources.mapLayer.locationHistInfo.time"/>{" "}{utilities.truncate(popupFeature.properties.simTime, simTimePrecision)}</p>
					</div>
				</Popup>
			}
		</Fragment>
	);
};

LocationHistoryInfo.propTypes = propTypes;

export default LocationHistoryInfo;
