import React, { useState, useEffect } from "react";

// Components
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import OptionsDrawerContainer from "./OptionsDrawer/OptionsDrawerContainer";

// Material UI
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { getTranslation } from "orion-components/i18n/I18nContainer";


const CamerasAppBar = ({ user, logOut, title, dir, baseMaps, map }) => {

	const [BaseMaps, setBaseMaps] = useState([]);
	const [optionsOpen, setOptionsOpen] = useState(false);

	useEffect(() => {
		setBaseMaps(baseMaps);
	}, [baseMaps]);


	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

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


	return (
		<div>
			<AppBar
				style={dir == "rtl" ? appBarStylesRTL : appBarStyles}
				title={title == "Cameras" ? getTranslation("appBar.title") : title} iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				iconStyleLeft={dir === "rtl" ? { marginTop: 0, marginRight: -16, marginLeft: 8 } : { marginTop: 0 }}
				iconElementLeft={
					<IconButton onClick={toggleOptionsDrawer}>
						<NavigationMenu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
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
							dir={dir}
						/>
					</div>
				}
			/>
			<ErrorBoundary>
				<OptionsDrawerContainer
					open={optionsOpen}
					toggleClosed={toggleOptionsDrawer}
					baseMaps={BaseMaps}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default CamerasAppBar;
