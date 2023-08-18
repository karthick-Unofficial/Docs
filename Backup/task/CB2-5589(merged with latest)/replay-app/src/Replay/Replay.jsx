import React, { memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// components
import ErrorBoundary from "orion-components/ErrorBoundary";
import ReplayMap from "../ReplayMapBase/ReplayMap";
import PlayBar from "./PlayBar/PlayBar";
import ListPanel from "./ListPanel/ListPanel";
import RightToolbar from "./RightToolbar/RightToolbar";
import isEqual from "lodash/isEqual";
import { getTranslation } from "orion-components/i18n";
import { Dialog } from "orion-components/CBComponents";
import querystring from "querystring";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./replayActions";
import { getDir } from "orion-components/i18n/Config/selector";

const ReplayWrapper = () => {
	const baseMaps = useSelector((state) => state.baseMaps);
	const transactionError = useSelector((state) => state.replay.error);
	const servicesReady = useSelector((state) => (window.api ? true : state.servicesReady));
	const dir = useSelector((state) => getDir(state));

	const getReplay = () => {
		if (servicesReady && baseMaps.length > 0) {
			return <Replay baseMaps={baseMaps} transactionError={transactionError} dir={dir} />;
		} else {
			return <div />;
		}
	};

	return getReplay();
};

const Replay = memo(
	({ baseMaps, dir, transactionError }) => {
		const dispatch = useDispatch();
		const { getSnapshot, getTimelineAlerts, addToDock, setMedia } = actionCreators;

		const loc = useLocation();

		const location = {};
		if (window.api) {
			// portable
			location.query = querystring.parse(window.location.search.substr(1));
		} else {
			location.query = querystring.parse(loc.search.substr(1));
		}

		const [openDialog, setOpenDialog] = useState(false);
		useEffect(() => {
			if (location && location.query) {
				// parse the coordinates
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

					newMedia
						.filter((media) => media !== "audio")
						.forEach((cameraId, index) => {
							dispatch(addToDock(cameraId, index));
						});
				}
			}
		}, [location]);

		useEffect(() => {
			setOpenDialog(transactionError === null ? false : true);
		}, [transactionError]);

		const toggleTransactionDialog = () => {
			setOpenDialog(false);
		};

		return (
			<div style={{ height: "100%", width: "100%", display: "flex" }}>
				<ErrorBoundary>
					<ListPanel endDate={location.query.endDate} />
					<div>
						<div style={{ height: "calc(100% - 100px)" }}>
							<ReplayMap location={location} baseMaps={baseMaps} />
						</div>
						<PlayBar startDate={location.query.startDate} endDate={location.query.endDate} />
					</div>
					{!window.api && (
						<RightToolbar startDate={location.query.startDate} endDate={location.query.endDate} />
					)}
				</ErrorBoundary>

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
	},
	(prevProps, nextProps) => {
		if (!isEqual(prevProps, nextProps)) {
			return false;
		}
		return true;
	}
);

Replay.displayName = "Replay";

export default ReplayWrapper;
