import React, { memo, useState } from "react";


// components
import NotificationsTab from "./Notifications/NotificationsTab";
import CamerasDock from "./Cameras/CameraDock";
import SystemHealth from "./SystemHealth/SystemHealth";
import ErrorBoundary from "../ErrorBoundary";
import ZetronCallingPanel from "./CallingPanel/ZetronCallingPanel";
import StatusBoard from "./StatusBoard/StatusBoard";

//Material UI
import Close from "@mui/icons-material/Close";

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null

};

const Dock = ({
	setTab,
	componentState,
	map,
	readOnly,
	dir,
	selectFloorPlanOn,
	floorPlansWithFacilityFeed,
	toggleOpen,
	notifications
}) => {
	const dispatch = useDispatch();

	const [feedType, setFeedType] = useState("newswire");

	const handleChange = (value) => {
		dispatch(setTab(value));
	};

	const handleFeedSelection = value => {
		setFeedType(value);
	};

	// TODO: MAKE CONTROLLED AND ADJUST LABEL AND INKBAR STYLES FOR UNSELECTED
	return (
		<div id="sidebar-inner-wrapper" className="cf">
			<ErrorBoundary>
				{componentState.isOpen && (
					<div
						onClick={() => dispatch(toggleOpen())}
						className="ad-toggle-mobile"
					>
						<a>
							<div className={dir && dir == "rtl" ? "close-ad-textRTL" : "close-ad-text"}>
								<Close sx={{ color: "#FFF" }} />
							</div>
						</a>
					</div>
				)}
				{componentState.tab === "Notifications" && (
					<ErrorBoundary>
						<div className="margin-container">
							<NotificationsTab
								map={map}
								notifications={notifications}
								componentState={componentState}
								selectFloorPlanOn={selectFloorPlanOn}
								floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
							/>
						</div>
					</ErrorBoundary>
				)}

				{componentState.tab === "Cameras" && (
					<ErrorBoundary>
						<CamerasDock map={map} readOnly={readOnly} selectFloorPlanOn={selectFloorPlanOn} floorPlansWithFacilityFeed={floorPlansWithFacilityFeed} />
					</ErrorBoundary>
				)}

				{componentState.tab === "System_health" && (
					<ErrorBoundary>
						<SystemHealth />
					</ErrorBoundary>
				)}

				{componentState.tab === "Status_board" && (
					<ErrorBoundary>
						<StatusBoard />
					</ErrorBoundary>
				)}

				{componentState.tab === "Calling_Panel" && (
					<ErrorBoundary>
						<ZetronCallingPanel />
					</ErrorBoundary>
				)}

			</ErrorBoundary>
		</div>
	);

};


Dock.propTypes = propTypes;
Dock.defaultProps = defaultProps;

export default memo(Dock);
