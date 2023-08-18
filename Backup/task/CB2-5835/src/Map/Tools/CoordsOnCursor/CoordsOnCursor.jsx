import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-mapbox-gl";
import { useSelector } from "react-redux";
import { mapObject, mapSettingsSelector, replayMapObject } from "orion-components/AppState/Selectors";
import { UnitParser } from "../../../CBComponents";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	replay: PropTypes.bool
};

const CoordsOnCursor = ({ replay }) => {
	const map = useSelector((state) => (replay ? replayMapObject(state) : mapObject(state)));
	const coordsOnCursor = useSelector((state) => mapSettingsSelector(state).coordsOnCursor || false);
	const [mouseMoveSet, setMouseMoveSet] = useState(false);
	const [tooltipLocation, setTooltipLocation] = useState(null);

	useEffect(() => {
		const mouseMoved = (e) => {
			setTooltipLocation(e.lngLat);
		};

		if (map && !mouseMoveSet) {
			map.on("mousemove", mouseMoved);
			setMouseMoveSet(true);
		}

		return () => {
			if (map && mouseMoveSet) {
				map.off("mousemove", mouseMoved);
			}
		};
	}, [map, mouseMoveSet]);

	return (
		coordsOnCursor &&
		tooltipLocation && (
			<Marker
				key="lat-lng-tooltip"
				coordinates={[tooltipLocation.lng, tooltipLocation.lat]}
				anchor="bottom-left"
				style={{ pointerEvents: "none" }}
			>
				<div
					style={{
						backgroundColor: "#00000066",
						padding: "2px 4px"
					}}
				>
					<p style={{ color: "#FFFFFF" }}>
						{`${getTranslation("global.map.tools.coordsOnCursor.lat")}: `}
						<UnitParser sourceUnit={"decimal-degrees"} value={tooltipLocation.lat} />
						{`, ${getTranslation("global.map.tools.coordsOnCursor.long")}: `}
						<UnitParser sourceUnit={"decimal-degrees"} value={tooltipLocation.lng} />
					</p>
				</div>
			</Marker>
		)
	);
};

CoordsOnCursor.propTypes = propTypes;

export default CoordsOnCursor;
