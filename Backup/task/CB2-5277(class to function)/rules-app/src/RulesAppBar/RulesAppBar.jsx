import React, { useState } from "react";

// material ui
import AppBar from "material-ui/AppBar";
import { Dock } from "orion-components/Dock";

// orion-components
import { AppMenu } from "orion-components/AppMenu";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const RulesAppBar = ({ toggleAppsMenu, user, logOut, title, dir }) => {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleTouchTap = (event) => {
		event.preventDefault(); // This prevents ghost click.

		setAnchorEl(event.currentTarget);

		toggleAppsMenu();
	};

	const handleRequestClose = () => {
		toggleAppsMenu();
	};

	return (
		<div style={{
			height: 48
		}}>
			<AppBar
				style={dir == "rtl" ? {
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
				titleStyle={dir == "rtl" ? {
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
				title={title == "Rules" ? getTranslation("appBar.title") : title}
				showMenuIconButton={false}
				iconElementRight={
					<div className="appBarWrapperRight">
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
				}
			/>
		</div>
	);
};

export default RulesAppBar;