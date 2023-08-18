import React, { memo, useState } from "react";


// components
import NotificationsTabContainer from "./Notifications/NotificationsTabContainer";
import CamerasDockContainer from "./Cameras/CameraDockContainer";
import SystemHealthContainer from "./SystemHealth/SystemHealthContainer";
import ErrorBoundary from "../ErrorBoundary";
import ZetronCallingPanelContainer from "./CallingPanel/ZetronCallingPanelContainer";

//Material UI
import Close from "material-ui/svg-icons/content/clear";

import PropTypes from "prop-types";

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
	const [feedType, setFeedType] = useState("newswire");

	const handleChange = (value) => {
		setTab(value);
	};

	const handleFeedSelection = value => {
		setFeedType(value);
	};

	//console.log("@@@", componentState.isOpen);

	// TODO: MAKE CONTROLLED AND ADJUST LABEL AND INKBAR STYLES FOR UNSELECTED
	return (
		<div id="sidebar-inner-wrapper" className="cf">
			<ErrorBoundary>
				{componentState.isOpen && (
					<div
						onClick={() => toggleOpen()}
						className="ad-toggle-mobile"
					>
						<a>
							<div className={dir && dir == "rtl" ? "close-ad-textRTL" : "close-ad-text"}>
								<Close />
							</div>
						</a>
					</div>
				)}
				{componentState.tab === "Notifications" && (
					<ErrorBoundary>
						<div className="margin-container">
							<NotificationsTabContainer
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
						<CamerasDockContainer map={map} readOnly={readOnly} selectFloorPlanOn={selectFloorPlanOn} floorPlansWithFacilityFeed={floorPlansWithFacilityFeed} />
					</ErrorBoundary>
				)}

				{componentState.tab === "System_health" && (
					<ErrorBoundary>
						<SystemHealthContainer />
					</ErrorBoundary>
				)}

				{componentState.tab === "Calling_Panel" && (
					<ErrorBoundary>
						<ZetronCallingPanelContainer />
					</ErrorBoundary>
				)}

			</ErrorBoundary>
		</div>
	);

};


Dock.propTypes = propTypes;
Dock.defaultProps = defaultProps;

export default memo(Dock);
