import React, { memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// components
import ErrorBoundary from "orion-components/ErrorBoundary";
import ReplayMap from "../ReplayMapBase/ReplayMap"
import PlayBar from "./PlayBar/PlayBar";
import ListPanel from "./ListPanel/ListPanel";
import RightToolbar from "./RightToolbar/RightToolbar";
import _ from "lodash";
import { getTranslation } from "orion-components/i18n";
import { Dialog } from "orion-components/CBComponents";
import querystring from "querystring";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./replayActions";
import { getDir } from "orion-components/i18n/Config/selector";
import { feedService } from "client-app-core";
import { appendReducer } from "../index";
import {
	dataByFeed
} from "orion-components/GlobalData/Reducers";

const ReplayWrapper = () => {
	const baseMaps = useSelector(state => state.baseMaps);
	const transactionError = useSelector(state => state.replay.error);
	const servicesReady = useSelector(state => window.api ? true : state.servicesReady);
	const dir = useSelector(state => getDir(state));
	const userId = useSelector(state => state.session.identity.userId);

	return (
		<Replay
			baseMaps={baseMaps}
			transactionError={transactionError}
			servicesReady={servicesReady}
			dir={dir}
			userId={userId}
		/>
	);
};
const Replay = memo(({
	servicesReady,
	baseMaps,
	dir,
	transactionError,
	userId
}) => {
	const dispatch = useDispatch();
	const { getSnapshot, getTimelineAlerts, addToDock, setMedia, subscribeFeed } = actionCreators;

	const loc = useLocation();

	const location = {};
	if (window.api) { // portable
		location.query = querystring.parse(window.location.search.substr(1));
	}
	else {
		location.query = querystring.parse(loc.search.substr(1));
	}

	const [openDialog, setOpenDialog] = useState(false);
	useEffect(() => {
		if (location && location.query) {
			// parse the coordinates
			setOpenDialog(transactionError === null ? false : true);
			const splitCoords = location.query.coordinates.split(",");
			const coordinates = [
				[parseFloat(splitCoords[0]), parseFloat(splitCoords[1])],
				[parseFloat(splitCoords[2]), parseFloat(splitCoords[3])]
			];
			dispatch(getSnapshot(location.query.startDate, location.query.endDate, coordinates));
			dispatch(getTimelineAlerts(location.query.startDate, location.query.endDate, coordinates));

			// -- set currentMedia and dockedCameras if available
			if (location.query.currentMedia) {
				const newMedia = location.query.currentMedia.split(",");
				dispatch(setMedia(newMedia));

				newMedia.filter(media => media !== "audio").forEach((cameraId, index) => {
					dispatch(addToDock(cameraId, index));
				});
			}
		}
	}, [getSnapshot, getTimelineAlerts, location, transactionError]);


	const toggleTransactionDialog = () => {
		setOpenDialog(false);
	};

	useEffect(() => {
		async function getInts() {
			await feedService.getUserAppIntegration(userId, "map-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.config.canView) {
							const geoName = "globalGeo." + feed.intId;
							// const dataName = "globalData." + feed.intId;
							const geoReducer = dataByFeed(feed.intId, "globalGeo");
							// const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(geoName, geoReducer);
							// appendReducer(dataName, dataReducer);
							dispatch(subscribeFeed(feed.intId));
						}
					});
				}
			});
		}
		getInts();
	}, []);


	return (
		<div style={{ height: "100%", width: "100%", display: "flex" }}>
			{servicesReady && (
				<ErrorBoundary>
					<ListPanel endDate={location.query.endDate} />
					<div>
						<div style={{ height: "calc(100% - 100px)" }} >
							<ReplayMap location={location} baseMaps={baseMaps} />
						</div>
						<PlayBar startDate={location.query.startDate} endDate={location.query.endDate} />
					</div>
					{(!window.api) && (
						<RightToolbar startDate={location.query.startDate} endDate={location.query.endDate} />
					)}
				</ErrorBoundary>
			)}

			<Dialog
				open={openDialog}
				confirm={{
					label: getTranslation("replay.replayScreen.ok"),
					action: toggleTransactionDialog
				}}
				textContent={transactionError}
				dir={dir}
			/>

		</div>
	);
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});

export default ReplayWrapper;