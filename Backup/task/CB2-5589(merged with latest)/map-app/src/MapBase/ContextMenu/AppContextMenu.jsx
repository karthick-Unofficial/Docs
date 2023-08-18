import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { ContextMenu, ContextMenuItem } from "orion-components/Map/ContextMenu";
import { NewEventContextMenu } from "./components";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { trackHistoryDuration as trackHistoryDurationSelector } from "orion-components/AppState/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	loadProfile,
	startTrackHistoryStream,
	addSpotlight,
	addNewContext,
	removeSubscriber,
	unsubscribeFromFeed
} from "./contextMenuActions";

const propTypes = {
	map: PropTypes.object.isRequired
};

const AppContextMenu = ({ map }) => {
	const dispatch = useDispatch();

	const profile = useSelector((state) => state.session.user.profile);
	const spotlights = useSelector((state) => state.spotlights);
	const trackHistory = useSelector((state) => trackHistorySelector(state));
	const trackHistoryDuration = useSelector((state) => trackHistoryDurationSelector(state));
	const dir = useSelector((state) => getDir(state));

	const [close, setClose] = useState(false);
	const [lngLat, setLngLat] = useState(null);
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
		const track = features.find((feature) => feature.properties.entityType === "track");
		if (track) {
			const hasHistory = trackHistoryContextsRef.current.indexOf(track.properties.id) > -1;
			setTrack(track);
			setTrackHistoryOn(hasHistory);
		} else {
			setTrack(null);
			setTrackHistoryOn(false);
		}
	};

	useEffect(() => {
		trackHistoryContextsRef.current = Object.keys(trackHistory);
	}, [trackHistory]);


	const handleAddSpotlight = () => {
		dispatch(
			addSpotlight({
				geometry: { type: "Point", coordinates: Object.values(lngLat) }
			})
		);
		setClose(true);
	};

	const handleTrackHistory = () => {
		if (trackHistoryOn) {
			//Turn off
			//TODO: remove context if profile not open
			dispatch(removeSubscriber(track.properties.id, "trackHistory", "map"));
			dispatch(unsubscribeFromFeed(track.properties.id, "trackHistory", "profile"));
			dispatch(unsubscribeFromFeed(track.properties.id, "entity", "profile"));
		} else {
			//Turn on
			dispatch(addNewContext(track.properties.id, track));
			dispatch(
				startTrackHistoryStream(
					{
						id: track.properties.id,
						entityType: track.properties.entityType,
						feedId: track.properties.feedId
					},
					"profile",
					trackHistoryDuration
				)
			);
		}
		setClose(true);
	};

	const spotlightsEnabled = useMemo(() => {
		return !!spotlights && Object.values(spotlights).filter((s) => !!s).length < 3;
	}, [spotlights]);

	return (
		<Fragment>
			<ContextMenu
				loadProfile={loadProfile}
				map={map}
				contextMenuOpening={contextMenuOpening}
				close={close}
				dir={dir}
			>
				{apps["events-app"] && (
					<NewEventContextMenu
						lngLat={lngLat}
					/>
				)}
				{apps["cameras-app"] && spotlightsEnabled && (
					<ContextMenuItem onClick={handleAddSpotlight}>
						<Translate value="mapBase.contextMenu.appContextMenu.initiateSpotlight" />
					</ContextMenuItem>
				)}
				{track && (
					<ContextMenuItem
						onClick={handleTrackHistory}
						style={trackHistoryOn ? { color: "rgb(53, 183, 243)" } : {}}
					>
						<Translate value="mapBase.contextMenu.appContextMenu.toggleHistory" />
					</ContextMenuItem>
				)}
			</ContextMenu>
		</Fragment>
	);
};

AppContextMenu.propTypes = propTypes;

export default AppContextMenu;
