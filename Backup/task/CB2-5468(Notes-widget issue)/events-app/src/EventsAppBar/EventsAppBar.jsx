import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Components
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import OptionsDrawer from "./OptionsDrawer/OptionsDrawer";

// Material UI
import { AppBar, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";
import { mapObject } from "orion-components/AppState/Selectors";

import { logOut, selectFloorPlanOn } from "./eventsAppBarActions";


const EventsAppBar = (props) => {

	let title = "Events";
	//const baseMaps = useSelector(state => state.baseMaps);
	const floorPlansWithFacilityFeed = useSelector(state => state.globalData.floorPlanWithFacilityFeedId.floorPlans);
	const application = useSelector(state => state.application);
	if (props.location.state && props.location.state.name) {
		title = props.location.state.name;
	}
	else if (application && application.name) {
		title = application.name;
	}
	const user = useSelector(state => state.session.user);
	const map = useSelector(state => mapObject(state));
	const dir = useSelector(state => getDir(state));

	const [optionsOpen, setOptionsOpen] = useState(false);
	const [baseMaps, setBaseMaps] = useState([]);

	useEffect(() => {
		setBaseMaps(baseMaps);
	}, [baseMaps]);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingRight: 6
		},
		appBarTitle: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			marginLeft: "12px"
		},
		iconButton: {
			height: 48,
			marginRight: 8,
			marginLeft: -16
		}
	};
	const stylesRTL = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingLeft: 6
		},
		appBarTitle: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			marginRight: "12px"
		},
		iconButton: {
			height: 48,
			marginLeft: 8,
			marginRight: -16
		}
	};

	return (
		<div>
			<AppBar
				style={dir == "rtl" ? stylesRTL.appBar : styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={dir == "rtl" ? stylesRTL.appBarTitle : styles.appBarTitle}>
						<div style={{ display: "flex" }}>
							<div style={dir == "rtl" ? stylesRTL.iconButton : styles.iconButton}>
								<IconButton onClick={toggleOptionsDrawer} style={{ color: "#FFF", width: 48 }}>
									<Menu />
								</IconButton>
							</div>
							{title === "Events" ? getTranslation("appBar.title") : title}
						</div>
					</div>

					<div style={dir === "ltr" ? { marginLeft: "auto", display: "flex" } : { marginRight: "auto", display: "flex" }}>
						<Dock
							map={map}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
						<AppMenu
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/>
					</div>
				</div>

			</AppBar >
			<ErrorBoundary>
				<OptionsDrawer
					open={optionsOpen}
					toggleClosed={toggleOptionsDrawer}
					baseMaps={baseMaps}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default EventsAppBar;