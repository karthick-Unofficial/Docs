import React, { useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";

// material ui
import AppBar from "material-ui/AppBar";
import { Dock } from "orion-components/Dock";

// orion-components
import { AppMenu } from "orion-components/AppMenu";
import { getTranslation } from "orion-components/i18n";
import * as actionCreators from "./rulesAppBarActions";
import { getDir } from "orion-components/i18n/Config/selector";

const RulesAppBar = ({ location }) => {
	const dispatch = useDispatch();

	const { toggleAppsMenu, logOut } = actionCreators;
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

	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState([]);

	const handleTouchTap = (event) => {
		event.preventDefault(); // This prevents ghost click.

		setAnchorEl(event.currentTarget);

		dispatch(toggleAppsMenu());
	};

	const handleRequestClose = () => {
		dispatch(toggleAppsMenu());
	};

	return (
		<div style={{
			height: 48
		}}>
			<AppBar
				style={dir === "rtl" ? {
					height: 48,
					lineHeight: "48px",
					backgroundColor: "#41454a",
					position: "fixed",
					zIndex: 600,
					textDecoration: "none",
					paddingLeft: "6px"
				} : {
					height: 48,
					lineHeight: "48px",
					backgroundColor: "#41454a",
					position: "fixed",
					zIndex: 600,
					textDecoration: "none",
					paddingRight: "6px"
				}}
				className="rulesAppBarTitle"
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={dir === "rtl" ? {
					lineHeight: "48px",
					textDecoration: "none",
					fontSize: "20px",
					marginRight: "48px"
				} : {
					lineHeight: "48px",
					textDecoration: "none",
					fontSize: "20px",
					marginLeft: "48px"
				}}
				title={title === "Rules" ? getTranslation("appBar.title") : title}
				showMenuIconButton={false}
				iconElementRight={
					<div className="appBarWrapperRight">
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
				}
			/>
		</div>
	);
};

export default RulesAppBar;