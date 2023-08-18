import React, { memo } from "react";
import { useStore } from "react-redux";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import { IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { logOut, openManager } from "./appBarActions";

const propTypes = {
	title: PropTypes.string,
	logOut: PropTypes.func.isRequired,
	openManager: PropTypes.func.isRequired,
	user: PropTypes.shape({
		profile: PropTypes.object.isRequired,
		isHydrated: PropTypes.bool.isRequired
	}),
	dir: PropTypes.string,
	location: PropTypes.object
};

const MyAppBar = ({ location }) => {

	const store = useStore();
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
		paddingLeft: 12,
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingRight: 6
	};
	const stylesRTL = {
		paddingRight: 12,
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingLeft: 6
	};

	return (
		<div>
			<AppBar
				style={dir == "rtl" ? stylesRTL : styles}
				title={title == "Berth Schedule" ? getTranslation("appBar.title") : title}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				iconStyleLeft={dir == "rtl" ? { margin: "0px 0px 0px 12px" } : { margin: "0px 12px 0px 0px" }}
				// preserves AppBar spacing between apps with/without left menu buttons
				iconElementLeft={
					<IconButton onClick={() => dispatch(openManager())} style={{ color: "#FFF" }}>
						<Menu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
						<AppMenu
							store={store}
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={() => dispatch(logOut())}
						/>
					</div>
				}
			/>
		</div>
	);
};

MyAppBar.propTypes = propTypes;

export default memo(MyAppBar);
