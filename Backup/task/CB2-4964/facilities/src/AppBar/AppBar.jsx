import React, { memo } from "react";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import { IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";


const propTypes = {
	title: PropTypes.string,
	logOut: PropTypes.func.isRequired,
	user: PropTypes.shape({
		profile: PropTypes.object.isRequired,
		isHydrated: PropTypes.bool.isRequired
	}),
	openSettingsMenu: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const MyAppBar = ({ user, logOut, title, openSettingsMenu, dir }) => {
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
				title={<Translate value="appBar.title" />}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				iconStyleLeft={dir == "rtl" ? { margin: "0px 0px 0px 12px" } : { margin: "0px 12px 0px 0px" }}
				iconElementLeft={
					<IconButton onClick={openSettingsMenu} style={{ color: "#FFF" }}>
						<Menu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
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

MyAppBar.propTypes = propTypes;

export default memo(MyAppBar);
