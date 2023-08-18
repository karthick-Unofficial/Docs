import React, { useState } from "react";
import { useSelector } from "react-redux";

// Components
import AppBar from "orion-components/AppBar/AppBar";
import OptionsDrawer from "orion-components/AppBar/OptionsDrawer/OptionsDrawer";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { mapObject } from "orion-components/AppState/Selectors";

import { selectFloorPlanOn } from "./eventsAppBarActions";

const EventsAppBar = () => {
	const floorPlansWithFacilityFeed = useSelector((state) => state.globalData.floorPlanWithFacilityFeedId.floorPlans);
	const map = useSelector((state) => mapObject(state));

	const [optionsOpen, setOptionsOpen] = useState(false);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	return (
		<div>
			<AppBar
				titleText="Events"
				toggleOptionsDrawer={toggleOptionsDrawer}
				map={map}
				selectFloorPlanOn={selectFloorPlanOn}
				floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
				isMenu={true}
			/>
			<ErrorBoundary>
				<OptionsDrawer open={optionsOpen} toggleClosed={toggleOptionsDrawer} disableSliders={true} />
			</ErrorBoundary>
		</div>
	);
};

export default EventsAppBar;
