import React, { memo } from "react";
import { useSelector } from "react-redux";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import { AppBar } from "@mui/material"
import { getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";
import { logOut } from "./appBarActions";
import PropTypes from "prop-types";


const propTypes = {
	location: PropTypes.object
};

const MyAppBar = (props) => {

	const application = useSelector(state => state.application);
	let title = "Law Enforcement Search";
	if (props.location.state && props.location.state.name) {
		title = props.location.state.name;
	}
	else if (application && application.name) {
		title = application.name;
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
			...(dir === "rtl" && { paddingLeft: 6 }),
			...(dir === "ltr" && { paddingRight: 6 })
		},
		appBarTitle: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			...(dir === "rtl" && { marginRight: "3%" }),
			...(dir === "ltr" && { marginLeft: "3%" })
		},
		dockWrapper: {
			...(dir === "ltr" && { marginLeft: "auto", display: "flex" }),
			...(dir === "rtl" && { marginRight: "auto", display: "flex" })
		}

	};

	return (
		<div>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						{title == "Law Enforcement Search" ? getTranslation("appBar.title") : title}
					</div>


					<div style={styles.dockWrapper}>
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
	);
};

MyAppBar.propTypes = propTypes;

export default memo(MyAppBar);
