import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import { AppBar, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import {
	logOut,
	openSettingsMenu,
	selectFloorPlanOn,
	closeSettingsMenu
} from "./appBarActions";
import { getDir } from "orion-components/i18n/Config/selector";

import _ from "underscore";
import OptionsDrawer from "orion-components/SharedComponents/OptionsDrawer/OptionsDrawer";
import ErrorBoundary from "orion-components/ErrorBoundary";

const MyAppBar = () => {

	const floorPlansWithFacilityFeed = useSelector(state => state.globalData.floorPlanWithFacilityFeedId.floorPlans, _.isEqual);
	const user = useSelector(state => state.session.user, _.isEqual);
	const dir = useSelector(state => getDir(state), _.isEqual);
	const open = useSelector(state => state.appState.settingsMenu.open);

	const dispatch = useDispatch();

	const styles = {
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
			display: "flex",
			...(dir === "ltr" && { marginLeft: "1%" }),
			...(dir === "rtl" && { marginRight: "1%" })
		},
		appBarTitleText: {
			...(dir === "rtl" ? { paddingRight: "10px" } : { paddingLeft: "10px" }),
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px"

		},
		appBarDockWrapper: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			display: "flex"
		}
	};

	const handleSelectFloorPlanOn = (floorplan, feedId) => {
		dispatch(selectFloorPlanOn(floorplan, feedId));
	};

	const handleDrawerClose = () => {
		dispatch(closeSettingsMenu());
	};

	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div>
							<IconButton onClick={() => dispatch(openSettingsMenu())} style={{ color: "#FFF" }}>
								<Menu />
							</IconButton>
						</div>
						<div style={styles.appBarTitleText}>
							{getTranslation("appBar.title")}
						</div>

					</div>

					<div style={styles.appBarDockWrapper}>
						<Dock shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={handleSelectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed} />
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
					open={open}
					toggleClosed={handleDrawerClose}
					settingsMenu={true}
				/>
			</ErrorBoundary>
		</div >
	);
};


export default memo(MyAppBar);
