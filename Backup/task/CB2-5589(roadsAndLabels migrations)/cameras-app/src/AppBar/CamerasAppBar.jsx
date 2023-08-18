import React, { useState } from "react";
import { useSelector } from "react-redux";

// Components

import OptionsDrawer from "orion-components/AppBar/OptionsDrawer/OptionsDrawer";

// Material UI

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { mapObject } from "orion-components/AppState/Map/selectors";
import AppBar from "orion-components/AppBar/AppBar";

const CamerasAppBar = () => {
	const map = useSelector((state) => mapObject(state));
	const [optionsOpen, setOptionsOpen] = useState(false);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	return (
		<div>
			<AppBar
				titleText="Cameras"
				toggleOptionsDrawer={toggleOptionsDrawer}
				map={map}
				isMenu={true}
			/>
			<ErrorBoundary>
				<OptionsDrawer
					open={optionsOpen}
					toggleClosed={toggleOptionsDrawer}
					spotlightProximity={true}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default CamerasAppBar;
