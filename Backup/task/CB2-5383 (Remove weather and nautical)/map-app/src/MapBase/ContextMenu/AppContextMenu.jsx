import React, { Fragment, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { ContextMenu, ContextMenuItem } from "orion-components/Map/ContextMenu";
import { NewEventDialog } from "./components";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	loadProfile: PropTypes.func.isRequired,
	map: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	addSpotlight: PropTypes.func.isRequired,
	trackHistory: PropTypes.object.isRequired,
	trackHistoryDuration: PropTypes.number.isRequired,
	startTrackHistoryStream: PropTypes.func.isRequired,
	addNewContext: PropTypes.func.isRequired,
	removeSubscriber: PropTypes.func.isRequired,
	unsubscribeFromFeed: PropTypes.func.isRequired,
	timeFormatPreference: PropTypes.string
};

const AppContextMenu = ({ 
	loadProfile, 
	map, 
	profile, 
	addSpotlight, 
	spotlights, 
	trackHistory, 
	trackHistoryDuration, 
	startTrackHistoryStream, 
	addNewContext,
	removeSubscriber,
	unsubscribeFromFeed,
	timeFormatPreference,
	dir
}) => {
	const [close, setClose] = useState(false);
	const [lngLat, setLngLat] = useState(null);
	const [dialog, setDialog] = useState(null);
	const [track, setTrack] = useState(null);
	const [trackHistoryOn, setTrackHistoryOn] = useState(true);
	const trackHistoryContextsRef = useRef([]);

	const apps = profile.applications.reduce((acc, curr) => {
		acc[curr.appId] = curr.config.canView;
		return acc;
	}, {});

	const contextMenuOpening = (features, lonLat) => {
		setClose(false);
		setLngLat(lonLat);
		const track = features.find(feature => feature.properties.entityType === "track");
		if (track) {
			const hasHistory = trackHistoryContextsRef.current.indexOf(track.properties.id) > -1;
			setTrack(track);
			setTrackHistoryOn(hasHistory);
		}
		else {
			setTrack(null);
			setTrackHistoryOn(false);
		}
	};

	useEffect(() => {
		trackHistoryContextsRef.current = Object.keys(trackHistory);
	}, [trackHistory]);

	const contextMenuClosing = () => {
		setDialog(null);
	};

	const handleOpenDialog = type => {
		setClose(true);
		setDialog(type);
	};

	const handleAddSpotlight = () => {
		addSpotlight({
			geometry: { type: "Point", coordinates: Object.values(lngLat) }
		});
		setClose(true);
	};

	const handleTrackHistory = () => {
		if (trackHistoryOn) {
			//Turn off
			//TODO: remove context if profile not open
			removeSubscriber(track.properties.id, "trackHistory", "map");
			unsubscribeFromFeed(track.properties.id, "trackHistory", "profile");
			unsubscribeFromFeed(track.properties.id, "entity", "profile");
		}
		else {
			//Turn on
			addNewContext(track.properties.id, track);
			startTrackHistoryStream(track.properties.id, "profile", trackHistoryDuration);
		}
		setClose(true);
	};

	const spotlightsEnabled =
		!!spotlights && Object.values(spotlights).filter(s => !!s).length < 3;

	return (
		<Fragment>
			<ContextMenu
				loadProfile={loadProfile}
				map={map}
				contextMenuOpening={contextMenuOpening}
				contextMenuClosing={contextMenuClosing}
				close={close}
				dir={dir}
			>
				{apps["events-app"] && (
					<ContextMenuItem onClick={() => handleOpenDialog("new-event")}>
						<Translate value="mapBase.contextMenu.appContextMenu.createEvent"/>
					</ContextMenuItem>
				)}
				{apps["cameras-app"] && spotlightsEnabled && (
					<ContextMenuItem onClick={handleAddSpotlight}><Translate value="mapBase.contextMenu.appContextMenu.initiateSpotlight"/></ContextMenuItem>
				)}
				{track && (
					<ContextMenuItem onClick={handleTrackHistory} style={trackHistoryOn ? {color: "rgb(53, 183, 243)"} : {}}><Translate value="mapBase.contextMenu.appContextMenu.toggleHistory"/></ContextMenuItem>
				)}
			</ContextMenu>
			<NewEventDialog
				open={dialog === "new-event"}
				close={() => setDialog(null) }
				lngLat={lngLat}
				loadProfile={loadProfile}
				timeFormatPreference={timeFormatPreference}
				dir={dir}
			/>
		</Fragment>
	);
};

AppContextMenu.propTypes = propTypes;

export default AppContextMenu;
