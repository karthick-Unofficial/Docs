import React from "react";

import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";

// material-ui
import AppBar from "material-ui/AppBar";

//i18n Translator
import { Translate } from "orion-components/i18n/I18nContainer";

const SettingsAppBar = ({ title, user, logOut, dir }) => {
	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingRight: 6
		},
		header: {
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis"
		},
		section: {
			padding: "10px 16px"
		},
		appBarRTL: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingLeft: 6,
			paddingRight: 24
		}
	};

	return (
		<div>
			<AppBar
				className="settings-app-bar"
				style={dir == "rtl" ? styles.appBarRTL : styles.appBar}
				title={
					<div className="settings-app-bar-title">
						<h3 style={styles.header}><Translate value="appBar.title" /></h3>
						<div />
					</div>
				}
				showMenuIconButton={false}
				iconStyleLeft={{
					marginTop: 0
				}}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px"
				}}
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

export default SettingsAppBar;
