import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getTranslation } from "orion-components/i18n/Actions/index.js";

// Components
import { Dock } from "orion-components/Dock";
import { AppMenu } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";

// Material UI
import { AppBar as MuiAppBar, IconButton } from "@mui/material";
import { logOut } from "../AppMenu";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import PropTypes from "prop-types";
import { Menu } from "@mui/icons-material";

const propTypes = {
	titleText: PropTypes.string,
	appId: PropTypes.string,
	handleGoHome: PropTypes.func,
	isMenu: PropTypes.bool,
	toggleOptionsDrawer: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object,
	selectFloorPlanOn: PropTypes.func,
	map: PropTypes.object
};

const defaultProps = {
	appId: "",
	handleGoHome: () => {},
	isMenu: false,
	toggleOptionsDrawer: () => {},
	map: {},
	floorPlansWithFacilityFeed: {},
	selectFloorPlanOn: () => {}
};

const AppBar = ({
	titleText,
	handleGoHome,
	appId,
	isMenu,
	toggleOptionsDrawer,
	floorPlansWithFacilityFeed,
	selectFloorPlanOn,
	map
}) => {
	const location = useLocation();
	let title;

	const user = useSelector((state) => state.session.user);
	const dir = useSelector((state) => getDir(state));
	const application = useSelector((state) => state.application);

	if (titleText) {
		title = titleText;
	} else if (location.state && location.state.name) {
		title = location.state.name;
	} else if (application && application.name) {
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
			...(dir === "rtl" && { paddingLeft: 6 })
		},
		appBarTitle: {
			display: "flex",
			...(dir === "ltr" && { marginLeft: "2%" }),
			...(dir === "rtl" && { marginRight: "2%" })
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
		},
		iconButton: {
			height: 48,
			...(dir === "rtl" && { marginLeft: 8, marginRight: -16 }),
			...(dir === "ltr" && { marginRight: 8, marginLeft: -16 })
		}
	};

	const renderTitle = () => {
		switch (appId) {
			case "reports-app":
				return (
					<div style={styles.appBarTitle}>
						{title !== "Reports" ? (
							<IconButton onClick={handleGoHome}>
								{dir === "rtl" ? (
									<ArrowForward style={{ color: "#ffffff" }} />
								) : (
									<ArrowBack style={{ color: "#ffffff" }} />
								)}
							</IconButton>
						) : (
							<IconButton />
						)}
						{getTranslation(title)}
					</div>
				);
			default:
				return (
					<div style={styles.appBarTitle}>
						{isMenu ? drawerMenu() : null}
						<div style={styles.appBarTitleText}>{title}</div>
					</div>
				);
		}
	};

	const drawerMenu = () => {
		return (
			<div style={styles.iconButton}>
				<IconButton onClick={toggleOptionsDrawer} style={{ color: "#FFF", width: 48 }}>
					<Menu />
				</IconButton>
			</div>
		);
	};

	return (
		<div>
			<MuiAppBar style={styles.appBar}>
				<div style={{ display: "flex" }}>
					{renderTitle()}

					<div style={styles.appBarDockWrapper}>
						<Dock
							map={map}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
						/>
						<AppMenu user={user.profile} isHydrated={user.isHydrated} logOut={logOut} />
					</div>
				</div>
			</MuiAppBar>
		</div>
	);
};

AppBar.propTypes = propTypes;
AppBar.defaultProps = defaultProps;

export default AppBar;
