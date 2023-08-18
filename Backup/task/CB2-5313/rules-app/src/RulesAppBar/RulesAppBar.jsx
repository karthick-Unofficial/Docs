import React, { useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";

// material ui
import { AppBar } from "@mui/material";
import { Dock } from "orion-components/Dock";

// orion-components
import { AppMenu } from "orion-components/AppMenu";
import { getTranslation } from "orion-components/i18n";
import * as actionCreators from "./rulesAppBarActions";
import { getDir } from "orion-components/i18n/Config/selector";

const RulesAppBar = ({ location }) => {
	const dispatch = useDispatch();

	const { logOut } = actionCreators;
	const application = useSelector(state => state.application);
	let title = "Rules";
	if (location.state && location.state.name) {
		title = location.state.name;
	}
	else if (application && application.name) {
		title = application.name;
	}
	const user = useSelector(state => state.session.user);
	const dir = useSelector(state => getDir(state));

	const store = useStore();


	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "fixed",
			textDecoration: "none",
			zIndex: 600,
			...(dir === "ltr" && { paddingRight: 6 }),
			...(dir === "rtl" && { paddingLeft: 6 })

		},
		appBarTitle: {
			display: "flex",
			...(dir === "ltr" && { marginLeft: "3%" }),
			...(dir === "rtl" && { marginRight: "3%" })
		},
		appBarTitleText: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px"

		},
		appBarMenuIcon: {
			...(dir === "ltr" && { margin: "0px 12px 0px 0px" }),
			...(dir === "rtl" && { margin: "0px 0px 0px 12px" })
		},
		appBarDockWrapper: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			display: "flex"
		}
	};
	return (
		<div style={{
			height: 48
		}}>

			<AppBar style={styles.appBar}>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div style={styles.appBarTitleText}>
							{title === "Rules" ? getTranslation("appBar.title") : title}
						</div>

					</div>

					<div style={styles.appBarDockWrapper}>
						<Dock
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
						/>
						<AppMenu
							store={store}
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/>
					</div>
				</div>

			</AppBar>
		</div>
	);
};

export default RulesAppBar;