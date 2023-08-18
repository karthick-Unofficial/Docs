import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Popup } from "react-mapbox-gl";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { UnitParser } from "orion-components/CBComponents";
import { timeConversion } from "client-app-core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object.isRequired,
	trackHistoryContexts: PropTypes.array.isRequired,
	timeFormatPreference: PropTypes.string.isRequired
};

const TrackHistoryInfo = ({ map, trackHistoryContexts, timeFormatPreference }) => {
	const [popups, setPopups] = useState({});
	const [popupOrder, setPopupOrder] = useState([]);
	const allowedProps = ["speed", "heading", "hdg", "course", "acquisitionTime"];

	const handlePointClick = useCallback(e => {
		e.preventDefault();

		const popupId = `${e.features[0].properties.id}-${e.features[0].properties.acquisitionTime}`;
		setPopups({
			...popups, [popupId]: {
				geometry: e.features[0].geometry,
				properties: e.features[0].properties
			}
		});
		setPopupOrder([...popupOrder, popupId]);
	}, [popups, popupOrder]);

	const handleClose = useCallback((e, id) => {
		e.preventDefault();
		e.stopPropagation();
		const newPopupOrder = [...popupOrder];
		newPopupOrder.splice(newPopupOrder.indexOf(id), 1);
		setPopupOrder(newPopupOrder);

		const newPopups = { ...popups };
		delete newPopups[id];
		setPopups(newPopups);
	}, [popups, popupOrder]);

	const handlePopupClick = useCallback(id => {
		const newPopupOrder = [...popupOrder];
		newPopupOrder.splice(newPopupOrder.indexOf(id), 1);
		newPopupOrder.push(id);
		setPopupOrder(newPopupOrder);
	}, [popupOrder]);

	useEffect(() => {
		map.on("click", "track-history-points", handlePointClick);

		return () => {
			map.off("click", "track-history-points", handlePointClick);
		};
	}, [handlePointClick]);

	useEffect(() => {
		const newPopupOrder = [];
		const newPopups = { ...popups };
		popupOrder.forEach(popupKey => {
			if (popups[popupKey] && trackHistoryContexts.indexOf(popups[popupKey].properties.id) > -1) {
				newPopupOrder.push(popupKey);
			}
			else {
				delete newPopups[popupKey];
			}
		});
		setPopupOrder(newPopupOrder);
		setPopups(newPopups);
	}, [trackHistoryContexts]);
	const popupOrderNullCheck = popupOrder.filter(popupId => {
		return popups[popupId];
	});
	return (
		<Fragment>
			{popupOrderNullCheck.map((popupId, index) => {
				return (
					<Popup
						key={popupId + `-${index}`}
						coordinates={popups[popupId] ? popups[popupId].geometry.coordinates : []}
						offset={12}
						onClick={e => handlePopupClick(popupId)}>
						<div>
							<IconButton
								style={{ padding: 0, position: "absolute", top: "2px", right: "2px" }}
								onClick={e => handleClose(e, popupId)}
							>
								<Cancel />
							</IconButton>

							{/* Latitude */}
							{popups[popupId].properties["lat"] && (
								<p key={`${popupId}-lat`}><Translate value="mapBase.trackHistoryInfo.lat"/> <UnitParser sourceUnit={"decimal-degrees"} value={popups[popupId].properties["lat"]} /></p>
							)}

							{/* Longitude */}
							{popups[popupId].properties["lng"] && (
								<p key={`${popupId}-lng`}><Translate value="mapBase.trackHistoryInfo.lon"/> <UnitParser sourceUnit={"decimal-degrees"} value={popups[popupId].properties["lng"]} /></p>
							)}

							{/* Speed */}
							{(popups[popupId].properties["speed"] || popups[popupId].properties["speed"] === 0) && (
								<p key={`${popupId}-speed`}><Translate value="mapBase.trackHistoryInfo.speed"/>  {popups[popupId].properties["speed"]}</p>
							)}

							{/* Heading */}
							{(popups[popupId].properties["hdg"] || popups[popupId].properties["heading"]) && (
								<p key={`${popupId}-heading`}><Translate value="mapBase.trackHistoryInfo.heading"/> {popups[popupId].properties["hdg"] ? popups[popupId].properties["hdg"] : popups[popupId].properties["heading"]}°</p>
							)}

							{/* Time */}
							{popups[popupId].properties["acquisitionTime"] && (
								<p key={`${popupId}-time`}>{timeConversion.convertToUserTime(popups[popupId].properties["acquisitionTime"], `full_${timeFormatPreference}`)}</p>
							)}
						</div>
					</Popup>
				);
			})}
		</Fragment>
	);
};

TrackHistoryInfo.propTypes = propTypes;

export default TrackHistoryInfo;
