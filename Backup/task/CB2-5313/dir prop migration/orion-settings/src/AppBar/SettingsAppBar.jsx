import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";

// material-ui
import { AppBar } from "@mui/material";

//i18n Translator
import { Translate } from "orion-components/i18n";
import { logOut } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";
import { getTranslation } from "orion-components/i18n/Actions";

const SettingsAppBar = ({ location }) => {

	let title = "Settings";
	useSelector(state => {
		if (location.state && location.state.name) {
			title = location.state.name;
		}
		else if (state.application && state.application.name) {
			title = state.application.name;
		}
	});
	const notifications = useSelector(state => {
		state.globalData.notifications.activeItems.map((id) => {
			return state.globalData.notifications.activeItemsById[id];
		});
	});
	const globalState = useSelector(state => state.appState.global);
	const user = useSelector(state => state.session.user);
	const dir = useSelector(state => getDir(state));


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


	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div style={styles.appBarTitleText}>
							{getTranslation("appBar.title")}
						</div>
					</div>

					<div style={styles.appBarDockWrapper}>
						<Dock
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
						/>
						<AppMenu
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/>
					</div>
				</div>

			</AppBar >
		</div>
	);
};

export default SettingsAppBar;
