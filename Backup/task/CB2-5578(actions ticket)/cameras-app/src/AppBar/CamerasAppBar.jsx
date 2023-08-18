import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logOut } from "./appBarActions";

// Components
import { Dock } from "orion-components/Dock";
import { AppMenu } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";
import OptionsDrawer from "./OptionsDrawer/OptionsDrawer";

// Material UI

import { IconButton, AppBar } from "@mui/material";// Update with CBAppBar component when possible
import { Menu } from "@mui/icons-material";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { getTranslation } from "orion-components/i18n";
import { mapObject } from "orion-components/AppState/Map/selectors";

const CamerasAppBar = () => {

	const location = useLocation();
	const map = useSelector(state => mapObject(state));
	const [optionsOpen, setOptionsOpen] = useState(false);


	const user = useSelector((state) => state.session.user);
	const dir = useSelector((state) => getDir(state));
	const application = useSelector((state) => state.application);
	const baseMaps = useSelector((state) => state.baseMaps);

	let title = "Cameras";
	if (location.state && location.state.name) {
		title = location.state.name;
	}
	else if (application && application.name) {
		title = application.name;
	}

	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			...(dir === "rtl" ? { paddingLeft: 6 } : { paddingRight: 6 })
		},
		appBarTitle: {
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			...(dir === "rtl" ? { marginRight: "12px" } : { marginLeft: "12px" })
		},
		iconButton: {
			height: 48,
			...(dir === "rtl" ? { marginLeft: 8, marginRight: -16, paddingRight: "10px" } : { marginRight: 8, marginLeft: -16, paddingLeft: "10px" })
		},
		dockWrapper: {
			...(dir === "rtl" ? { marginRight: "auto", display: "flex" } : { marginLeft: "auto", display: "flex" })
		}
	};

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div style={{ display: "flex" }}>
							<div style={styles.iconButton}>
								<IconButton onClick={toggleOptionsDrawer} style={{ color: "#FFF" }}>
									<Menu />
								</IconButton>
							</div>
							{title === "Cameras" ? getTranslation("appBar.title") : title}
						</div>
					</div>

					<div style={styles.dockWrapper}>
						<Dock
							map={map}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
							dir={dir}
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

export default CamerasAppBar;