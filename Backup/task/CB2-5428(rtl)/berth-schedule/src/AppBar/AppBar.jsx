import React, { memo } from "react";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import { AppBar, IconButton } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { logOut, openManager } from "./appBarActions";
import { Menu } from "@mui/icons-material";

const propTypes = {
	location: PropTypes.object
};

const MyAppBar = ({ location }) => {

	const dispatch = useDispatch();
	const appName = useSelector(state => state.application && state.application.name);

	let title = "Berth Schedule";
	if (location.state && location.state.name) {
		title = location.state.name;
	}
	else {
		title = appName;
	}
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
			...(dir === "rtl" && { paddingLeft: 6 }),

		},
		appBarTitle: {
			display: "flex",
			...(dir === "ltr" && { marginLeft: "1%" }),
			...(dir === "rtl" && { marginRight: "1%" }),
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

			<div>
				<AppBar
					style={styles.appBar}
				>
					<div style={{ display: "flex" }}>
						<div style={styles.appBarTitle}>
							<div stlye={styles.appBarMenuIcon}>
								<IconButton onClick={() => dispatch(openManager())} style={{ color: "#FFF" }}>
									<Menu />
								</IconButton>
							</div>
							<div style={styles.appBarTitleText}>
								{title == "Berth Schedule" ? getTranslation("appBar.title") : title}
							</div>
						</div>

						<div
							style={styles.appBarDockWrapper}>
							<Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
							<AppMenu
								user={user.profile}
								isHydrated={user.isHydrated}
								logOut={logOut}
							/>
						</div>
					</div>

				</AppBar >
			</div>

		</div>
	);
};

MyAppBar.propTypes = propTypes;

export default memo(MyAppBar);
