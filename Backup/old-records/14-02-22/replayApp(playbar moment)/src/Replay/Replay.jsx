import React, { memo, useState, useEffect, useCallback, Fragment } from "react";
import PropTypes from "prop-types";
// components
import ErrorBoundary from "orion-components/ErrorBoundary";
import ReplayMapContainer from "../ReplayMapBase/ReplayMapContainer";
import PlayBarContainer from "./PlayBar/PlayBarContainer";
import ListPanelContainer from "./ListPanel/ListPanelContainer";
import RightToolbarContainer from "./RightToolbar/RightToolbarContainer";
import _ from "lodash";

const propTypes = {
	servicesReady: PropTypes.bool,
	location: PropTypes.object,
	getSnapshot: PropTypes.func,
	getTimelineAlerts: PropTypes.func,
	baseMaps: PropTypes.array.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
};

const styles = {
};



const Replay = ({
	servicesReady,
	location,
	getSnapshot,
	getTimelineAlerts,
	addToDock,
	setMedia,
	baseMaps,
	dir
}) => {
	useEffect(() => {
		if (location && location.query) {
			// parse the coordinates
			const splitCoords = location.query.coordinates.split(",");
			const coordinates = [
				[parseFloat(splitCoords[0]), parseFloat(splitCoords[1])],
				[parseFloat(splitCoords[2]), parseFloat(splitCoords[3])]
			];
			getSnapshot(location.query.startDate, location.query.endDate, coordinates);
			getTimelineAlerts(location.query.startDate, location.query.endDate, coordinates);

			// -- set currentMedia and dockedCameras if available
			if (location.query.currentMedia) {
				const newMedia = location.query.currentMedia.split(",");
				setMedia(newMedia);

				newMedia.filter(media => media !== "audio").forEach((cameraId, index) => {
					addToDock(cameraId, index);
				});
			}
		}
	}, [getSnapshot, getTimelineAlerts, location]);
	return (
		<div style={{ height: "100%", width: "100%", display: "flex" }}>
			{servicesReady && (
				<ErrorBoundary>
					<ListPanelContainer endDate={location.query.endDate} />
					<div>
						<div style={{ height: "calc(100% - 100px)" }} >
							<ReplayMapContainer location={location} baseMaps={baseMaps} />
						</div>
						<PlayBarContainer startDate={location.query.startDate} endDate={location.query.endDate} />
					</div>
					{(!window.api) && (
						<RightToolbarContainer startDate={location.query.startDate} endDate={location.query.endDate} />
					)}
				</ErrorBoundary>
			)}
		</div>
	);
};

Replay.propTypes = propTypes;
Replay.defaultProps = defaultProps;

export default memo(Replay, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
