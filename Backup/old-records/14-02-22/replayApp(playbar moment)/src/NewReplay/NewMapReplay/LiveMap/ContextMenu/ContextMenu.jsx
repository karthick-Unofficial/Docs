import React, { Fragment, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, Popover, Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	loadProfile: PropTypes.func.isRequired,
	map: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	trackHistory: PropTypes.object.isRequired,
	trackHistoryDuration: PropTypes.number.isRequired,
	startTrackHistoryStream: PropTypes.func.isRequired,
	addNewContext: PropTypes.func.isRequired,
	removeSubscriber: PropTypes.func.isRequired,
	unsubscribeFromFeed: PropTypes.func.isRequired
};

const ContextMenu = ({
	map, 
	profile,
	trackHistory, 
	trackHistoryDuration, 
	startTrackHistoryStream, 
	addNewContext,
	removeSubscriber,
	unsubscribeFromFeed 
}) => {
	const [anchorPosition, setAnchorPosition] = useState(null);
	const [lngLat, setLngLat] = useState(null);
	const [dialog, setDialog] = useState(null);
	const [trackHistoryContexts, setTrackHistoryContexts] = useState([]);
	const [track, setTrack] = useState(null);
	const [trackHistoryOn, setTrackHistoryOn] = useState(true);

	const apps = profile.applications.reduce((acc, curr) => {
		acc[curr.appId] = curr.config.canView;
		return acc;
	}, {});
	const handleContextMenu = useCallback((e) => {
		const features = map.queryRenderedFeatures(e.point).filter(feature => feature.source !== "composite");
		const track = features.find(feature => feature.properties.entityType === "track");
		if (track) {
			const hasHistory = trackHistoryContexts.indexOf(track.properties.id) > -1;
			setTrack(track);
			setTrackHistoryOn(hasHistory);
		}
		else {
			setTrack(null);
			setTrackHistoryOn(false);
		}
		e.preventDefault();
		const { x, y } = e.point;
		setAnchorPosition({ top: y + 48, left: x });
		setLngLat(e.lngLat);
	}, [map, trackHistoryContexts]);

	useEffect(() => {
		setTrackHistoryContexts(Object.keys(trackHistory));
	}, [trackHistory]);

	const handleClose = useCallback(() => {
		setAnchorPosition(null);
		setDialog(null);
	}, []);

	useEffect(() => {
		map.on("contextmenu", handleContextMenu);
		return () => {
			map.off("contextmenu", handleContextMenu);
			handleClose();
		};
	}, [handleClose, handleContextMenu, map]);

	const handleTrackHistory = () => {
		if (trackHistoryOn) {
			//Turn off
			//TODO: remove context if profile not open
			removeSubscriber(track.properties.id, "trackHistory", "map");
			unsubscribeFromFeed(track.properties.id, "trackHistory", "profile");
		}
		else {
			//Turn on
			addNewContext(track.properties.id, track);
			startTrackHistoryStream(track.properties.id, "profile", trackHistoryDuration);
		}
	};
	return (
		<Fragment>
			<Popover
				open={!!anchorPosition}
				anchorReference="anchorPosition"
				anchorPosition={anchorPosition}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handleClose}
			>
				{track && (
					<MenuItem onClick={handleTrackHistory} style={trackHistoryOn ? {color: "rgb(53, 183, 243)"} : {}}>Toggle History</MenuItem>
				)}
				{!apps["events-app"] && !apps["cameras-app"] && (
					<Typography variant="body2" style={{ padding: "12px 16px" }}>
						<Translate value="newReplay.newMapReplay.contextMenu.noActions" />
					</Typography>
				)}
			</Popover>
		</Fragment>
	);
};

ContextMenu.propTypes = propTypes;

export default ContextMenu;
