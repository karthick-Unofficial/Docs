import React, { useState, useEffect } from "react";
import { useStore, useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { logOut } from "./appBarActions";

// Components
import { Dock } from "orion-components/Dock";
import { AppMenu } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";
import OptionsDrawer from "./OptionsDrawer/OptionsDrawer";

// Material UI
import AppBar from "material-ui/AppBar"; // Update with CBAppBar component when possible
import { IconButton } from "@material-ui/core";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const CamerasAppBar = ({ map }) => {

	const store = useStore();
	const dispatch = useDispatch();
	const location = useLocation();

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

	const appBarStyles = {
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingRight: 6
	};
	const appBarStylesRTL = {
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingLeft: 6
	};

	const doLogOut = () => {
		dispatch(logOut());
	};

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};	

	return (
		<div>
			<AppBar
				style={dir === "rtl" ? appBarStylesRTL : appBarStyles}
				title={title === "Cameras" ? getTranslation("appBar.title") : title}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				iconStyleLeft={{ margin: 0 }}
				// preserves AppBar spacing between apps with/without left menu buttons
				iconElementLeft={
					<IconButton onClick={toggleOptionsDrawer}>
						<NavigationMenu />
					</IconButton>
				}				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock
							map={map}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
							dir={dir}
						/>
						<AppMenu
							store={store}
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={doLogOut}
							dir={dir}
						/>
					</div>
				}
			/>
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