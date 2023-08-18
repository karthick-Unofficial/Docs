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
		flex: {
			display: "flex"
		},
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			...(dir === "ltr" && { paddingRight: 6 }),
			...(dir === "rtl" && { paddingLeft: 6 })
		},
		appBarTitle: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			...(dir === "ltr" && { marginLeft: "12px" }),
			...(dir === "rtl" && { marginRight: "12px" })
		},
		iconButton: {
			height: 48,
			...(dir === "ltr" && { marginRight: 8, marginLeft: -16 }),
			...(dir === "rtl" && { marginLeft: 8, marginRight: -16 })
		},
		dockAndAppMenu: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			display: "flex"
		},
		iconButton: {
			color: "#FFF",
			width: 48
		}
	};

	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={styles.flex}>
					<div style={styles.appBarTitle}>
						<div style={styles.flex}>
							<div style={styles.iconButton}>
								<IconButton onClick={toggleOptionsDrawer} style={styles.iconButton}>
									<Menu />
								</IconButton>
							</div>
							{title === "Events" ? getTranslation("appBar.title") : title}
						</div>
					</div>

					<div style={styles.dockAndAppMenu}>
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