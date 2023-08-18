import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logOut } from "./appBarActions";

// Components
import { Dock } from "orion-components/Dock";
import { AppMenu } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";

// Material UI
import { AppBar } from "@mui/material";// Update with CBAppBar component when possible

import { getTranslation } from "orion-components/i18n";

const MyAppBar = () => {

	const location = useLocation();

	const user = useSelector((state) => state.session.user);
	const dir = useSelector((state) => getDir(state));
	const application = useSelector((state) => state.application);

	let title = "Lists";
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
			...(dir === "ltr" && { paddingRight: 6 }),
			...(dir === "rtl" && { paddingLeft: 6 }),

		},
		appBarTitle: {
			display: "flex",
			...(dir === "ltr" && { marginLeft: "2%" }),
			...(dir === "rtl" && { marginRight: "2%" }),
		},
		appBarTitleText: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",

		},
		appBarMenuIcon: {
			...(dir === "ltr" && { margin: "0px 12px 0px 0px" }),
			...(dir === "rtl" && { margin: "0px 0px 0px 12px" }),
		},
		appBarDockWrapper: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			display: "flex"
		}
	};


	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div style={styles.appBarTitleText}>
							{title === "Lists" ? getTranslation("appBar.title") : title}
						</div>
					</div>

					<div style={styles.appBarDockWrapper}>
						{/* <Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
						<AppMenu
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/> */}
					</div>
				</div>

			</AppBar >
		</div>
	);
};

export default MyAppBar;
